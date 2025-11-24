import dbConnect from '@/lib/db';
import { Prompts } from '@/models';
import { NextResponse } from 'next/server';
import type { FilterQuery, SortOrder } from 'mongoose';
import { PromptType } from '@/types/data';
// import type { PromptType } from '@/types/models';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const limit = Math.max(1, Number(searchParams.get('limit')) || 24);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const rawTags = searchParams.get('tags');
    const sortParam = searchParams.get('sort');
    const searchRaw = searchParams.get('search');

    // -------------------------
    // TAGS
    // -------------------------
    let tags: string[] | null = null;

    if (rawTags && rawTags.trim() && rawTags !== 'undefined') {
      tags = rawTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    // -------------------------
    // SEARCH
    // -------------------------
    const search =
      searchRaw && searchRaw.trim() && searchRaw !== 'undefined'
        ? searchRaw.trim()
        : null;

    const skip = (page - 1) * limit;

    // -------------------------
    // FILTER (کاملاً تایپ‌شده)
    // -------------------------
    const where: FilterQuery<PromptType> = {
      isPremium: false,
    };

    if (tags) {
      where.tags = { $in: tags };
    }

    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } },
      ];
    }

    // -------------------------
    // SORT (بدون any)
    // -------------------------
    const sort: Record<string, SortOrder> = {};

    switch (sortParam) {
      case 'likes desc':
        sort.likes = -1;
        break;
      case 'likes asc':
        sort.likes = 1;
        break;
      case 'date desc':
        sort.createdAt = -1;
        break;
      case 'date asc':
        sort.createdAt = 1;
        break;
      default:
        sort.likes = -1; // default
    }

    // -------------------------
    // QUERY (کاملاً typed)
    // -------------------------
    const total = await Prompts.countDocuments(where);

    const prompts = await Prompts.find(where)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean<PromptType[]>(); // ← این باعث میشه خروجی 100٪ تایپ باشه

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'Prompts fetched successfully 🚀',
      data: prompts,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching prompts',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        pagination: null,
      },
      { status: 500 }
    );
  }
}
