import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Favorite, Prompts, Users, PromptFavorite } from '@/models';
import { IFavorite, IUser } from '@/types/models';
import { PromptType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { promptsQuerySchema } from '@/validation/DTO';
import { CacheTags, bustCache, cacheLife, cacheTag } from '@/lib/cache';

const getCachedPrompts = async (
  page: number,
  limit: number,
  sortParam: string | undefined,
  rawTags: string | undefined,
  search: string | undefined,
  status: string | undefined,
  favoriteId: string | null
) => {
  'use cache';

  cacheTag(CacheTags.prompts, CacheTags.favorites);
  cacheLife('weeks');

  await dbConnect();

  const skip = (page - 1) * limit;

  const where: FilterQuery<PromptType> = {};

  if (rawTags) {
    const tagsArray = rawTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagsArray.length > 0) where.tags = { $in: tagsArray };
  }

  if (search) {
    where.$or = [
      { title: { $regex: search, $options: 'i' } },
      { prompt: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'All') {
    where.status = status;
  }

  const sort: Record<string, SortOrder> = {};
  if (sortParam === 'likes asc') sort.likes = 1;
  else if (sortParam === 'date desc') sort.createdAt = -1;
  else if (sortParam === 'date asc') sort.createdAt = 1;
  else sort.likes = -1;

  const [total, promptsRaw] = await Promise.all([
    Prompts.countDocuments(where),
    Prompts.find(where).sort(sort).skip(skip).limit(limit).lean<PromptType[]>(),
  ]);

  let prompts = promptsRaw;

  if (favoriteId && prompts.length > 0) {
    const promptIds = prompts.map((p) => p._id);
    const favoritedEntries = await PromptFavorite.find({
      favoriteId,
      promptId: { $in: promptIds },
    })
      .select('promptId')
      .lean();

    const favoritedSet = new Set(
      favoritedEntries.map((f) => f.promptId.toString())
    );

    prompts = prompts.map((p) => ({
      ...p,
      isFavorited: favoritedSet.has(p._id.toString()),
    })) as typeof promptsRaw;
  }

  const totalPages = Math.ceil(total / limit);

  return {
    data: JSON.parse(JSON.stringify(prompts)),
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
  try {
    const { searchParams } = new URL(req.url);

    let validatedData;
    try {
      validatedData = await promptsQuerySchema.validate({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        sort: searchParams.get('sort'),
        tags: searchParams.get('tags'),
        search: searchParams.get('search'),
        status: searchParams.get('status'),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown validation error';
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const {
      page,
      limit,
      sort: sortParam,
      tags: rawTags,
      search,
      status,
    } = validatedData;

    // Resolve favoriteId for the current user (not cached, per-request)
    let favoriteId: string | null = null;
    const { userId: clerkId } = await auth();

    if (clerkId) {
      await dbConnect();
      const user = await Users.findOne({ clerkId })
        .select('_id')
        .lean<IUser | null>();
      if (user) {
        const favDoc = await Favorite.findOne({ userId: user._id })
          .select('_id')
          .lean<IFavorite | null>();
        favoriteId = favDoc?._id?.toString() ?? null;
      }
    }

    const result = await getCachedPrompts(
      page,
      limit,
      sortParam ?? 'likes desc',
      rawTags ?? undefined,
      search ?? undefined,
      status ?? undefined,
      favoriteId
    );

    return NextResponse.json({
      success: true,
      message: 'Prompts fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { promptId } = await req.json();

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' });
    }

    await dbConnect();

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'isNotAuthenticated',
      });
    }

    const prompt = await Prompts.findById(promptId);
    if (!prompt) {
      return NextResponse.json({ success: false, message: 'Prompt not found' });
    }

    if (user._id.toString() !== prompt.creatorId.toString()) {
      return NextResponse.json({ success: false, message: 'Unauthorized' });
    }

    await Prompts.findByIdAndDelete(promptId);

    // Bust the prompts cache after deletion
    bustCache(CacheTags.prompts);

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully',
    });
  } catch (error) {
    console.error('Delete prompt error:', error);
    return NextResponse.json({ success: false, message: 'Prompt not found' });
  }
}
