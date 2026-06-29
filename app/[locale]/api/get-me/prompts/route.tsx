import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { NextResponse } from 'next/server';
import type { FilterQuery, SortOrder } from 'mongoose';
import { PromptType } from '@/types/data';
import { auth } from '@clerk/nextjs/server';
import { IUser } from '@/types/models';
import { promptsQuerySchema } from '@/validation/DTO';
import { CacheTags, cacheLife, cacheTag } from '@/lib/cache';

/**
 * Cached function that fetches a specific user's prompts with filters and pagination.
 * Keyed by userId + query params so different users don't share cache entries.
 */
const getCachedUserPrompts = async (
  userId: string,
  page: number,
  limit: number,
  sortParam?: string | null,
  rawTags?: string | null,
  search?: string | null,
  status?: string | null
) => {
  'use cache';
  cacheTag(CacheTags.prompts);
  cacheLife('weeks');

  await dbConnect();

  const where: FilterQuery<PromptType> = {
    creatorId: userId,
  };

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

  if (status) {
    where.status = status;
  }

  const sort: Record<string, SortOrder> = {};
  if (sortParam === 'likes desc') sort.likes = -1;
  else if (sortParam === 'likes asc') sort.likes = 1;
  else if (sortParam === 'date asc') sort.createdAt = 1;
  else if (sortParam === 'title asc') sort.title = 1;
  else if (sortParam === 'title desc') sort.title = -1;
  else sort.createdAt = -1;

  const skip = (page - 1) * limit;

  const [allCount, total, promptsRaw] = await Promise.all([
    Prompts.countDocuments({ creatorId: userId }),
    Prompts.countDocuments(where),
    Prompts.find(where).sort(sort).skip(skip).limit(limit).lean<PromptType[]>(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: JSON.parse(JSON.stringify(promptsRaw)),
    allCount,
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

    // Validate input with DTO
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
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message?: unknown }).message)
            : 'Unknown error';
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

    // Authentication (required for this route)
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await Users.findOne({ clerkId })
      .select('_id')
      .lean<IUser | null>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const result = await getCachedUserPrompts(
      user._id.toString(),
      page,
      limit,
      sortParam,
      rawTags,
      search,
      status
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching user prompts' },
      { status: 500 }
    );
  }
}
