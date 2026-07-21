import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Prompts } from '@/models';
import { PromptType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { promptsQuerySchema } from '@/validation/DTO';
import { CacheTags, cacheLife, cacheTag } from '@/lib/cache';

const getCachedPrompts = async (
  page: number,
  limit: number,
  sortParam: string,
  rawTags: string | undefined,
  search: string | undefined,
  status: string | undefined
) => {
  'use cache';

  cacheTag(CacheTags.prompts);
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

  const [total, prompts] = await Promise.all([
    Prompts.countDocuments(where),
    Prompts.find(where).sort(sort).skip(skip).limit(limit).lean<PromptType[]>(),
  ]);

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

    const result = await getCachedPrompts(
      page,
      limit,
      sortParam ?? 'likes desc',
      rawTags ?? undefined,
      search ?? undefined,
      status ?? undefined,
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
