import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Favorite, Prompts, Users, PromptFavorite } from '@/models';
import { IFavorite, IUser } from '@/types/models';
import { PromptType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { promptsQuerySchema } from '@/validation/DTO';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // ۱. اعتبارسنجی با DTO
    let validatedData;
    try {
      validatedData = await promptsQuerySchema.validate({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        sort: searchParams.get('sort'),
        tags: searchParams.get('tags'),
        search: searchParams.get('search'),
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
    } = validatedData;
    const skip = (page - 1) * limit;

    // ۲. احراز هویت و پیدا کردن FavoriteId (بدون تغییر در منطق شما)
    const { userId: clerkId } = await auth();
    let favoriteId: string | null = null;

    if (clerkId) {
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

    // ۴. آماده‌سازی Sort
    const sort: Record<string, SortOrder> = {};
    if (sortParam === 'likes asc') sort.likes = 1;
    else if (sortParam === 'date desc') sort.createdAt = -1;
    else if (sortParam === 'date asc') sort.createdAt = 1;
    else sort.likes = -1; // Default: likes desc

    // ۵. اجرای کوئری‌ها
    const [total, promptsRaw] = await Promise.all([
      Prompts.countDocuments(where),
      Prompts.find(where)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<PromptType[]>(),
    ]);

    let prompts = promptsRaw;

    // ۶. منطق isFavorited
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
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
