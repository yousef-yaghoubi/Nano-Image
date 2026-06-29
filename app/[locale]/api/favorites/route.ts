import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Favorite, Users, PromptFavorite } from '@/models';
import { IFavorite, IUser } from '@/types/models';
import { getTranslations } from 'next-intl/server';
import { favoriteQuerySchema } from '@/validation/DTO';
import { CacheTags, cacheLife, cacheTag } from '@/lib/cache';

/**
 * Cached function that fetches a user's favorite prompts with aggregation.
 * Keyed by userId + pagination params.
 */
const getCachedFavorites = async (
  userId: string,
  page: number,
  limit: number,
  sortParam?: string | null
) => {
  'use cache';
  cacheTag(CacheTags.favorites, CacheTags.prompts);
  cacheLife('weeks');

  await dbConnect();

  let sort: { [key: string]: 1 | -1 } = { 'prompt.likes': -1 };
  let isSortingByPromptField = true;

  if (sortParam === 'date asc' || sortParam === 'date desc') {
    sort = { createdAt: sortParam === 'date asc' ? 1 : -1 };
    isSortingByPromptField = false;
  } else {
    sort = { 'prompt.likes': sortParam === 'likes asc' ? 1 : -1 };
    isSortingByPromptField = true;
  }

  const favorite = (await Favorite.findOne({
    userId,
  }).lean()) as IFavorite | null;

  if (!favorite) {
    return {
      data: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  const pipeline = [
    { $match: { favoriteId: favorite._id } },
    ...(!isSortingByPromptField ? [{ $sort: sort }] : []),
    {
      $lookup: {
        from: 'prompts',
        localField: 'promptId',
        foreignField: '_id',
        as: 'prompt',
      },
    },
    { $unwind: '$prompt' },
    ...(isSortingByPromptField ? [{ $sort: sort }] : []),
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $replaceRoot: {
        newRoot: { $mergeObjects: ['$prompt', { isFavorited: true }] },
      },
    },
  ];

  const [data, totalResult] = await Promise.all([
    PromptFavorite.aggregate(pipeline),
    PromptFavorite.aggregate([
      { $match: { favoriteId: favorite._id } },
      {
        $lookup: {
          from: 'prompts',
          localField: 'promptId',
          foreignField: '_id',
          as: 'prompt',
        },
      },
      { $unwind: '$prompt' },
      { $count: 'total' },
    ]),
  ]);

  const total = totalResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: JSON.parse(JSON.stringify(data)),
    pagination: {
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export async function GET(req: Request) {
  const t = await getTranslations('Messages');

  try {
    const { searchParams } = new URL(req.url);

    // Validate input with DTO
    let validatedData;
    try {
      validatedData = await favoriteQuerySchema.validate({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        sort: searchParams.get('sort'),
      });
    } catch (validationError) {
      if (validationError instanceof Error) {
        return NextResponse.json(
          { success: false, message: validationError.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: 'Unknown validation error' },
        { status: 400 }
      );
    }

    const { page, limit, sort: sortParam } = validatedData;

    // Authentication
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, message: t('isNotAuthenticated') },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = (await Users.findOne({
      clerkId: clerkUserId,
    }).lean()) as IUser | null;
    if (!user) {
      return NextResponse.json(
        { success: false, message: t('userNotFound') },
        { status: 404 }
      );
    }

    const result = await getCachedFavorites(
      user._id.toString(),
      page,
      limit,
      sortParam
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: t('generic'),
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
