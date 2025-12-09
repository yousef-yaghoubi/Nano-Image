import dbConnect from '@/lib/db';
import { Favorite, Prompts, Users, PromptFavorite } from '@/models'; // Added Users and PromptFavorite
import { NextResponse } from 'next/server';
import type { FilterQuery, SortOrder } from 'mongoose';
import { PromptType } from '@/types/data';
import { ObjectId } from 'mongodb'; // Still needed for promptIds
import { auth } from '@clerk/nextjs/server';
import { IFavorite, IUser } from '@/types/models';

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
    // USER ID (Clerk ID)
    // -------------------------
    const { userId: clerkId } = await auth(); // Renamed to clerkId for clarity
    let mongooseUserId: ObjectId | null = null;
    let favoriteId: ObjectId | null = null;

    if (clerkId) {
      // 1. Find the Mongoose User document using the Clerk ID
      const user = await Users.findOne({ clerkId })
        .select('_id')
        .lean<IUser | null>();

      if (user) {
        mongooseUserId = user._id;

        // 2. Find the user's main Favorite document using the Mongoose User ID
        const favoriteDoc = await Favorite.findOne({ userId: mongooseUserId })
          .select('_id')
          .lean<IFavorite | null>();

        if (favoriteDoc) {
          favoriteId = favoriteDoc._id;
        }
      }
    }
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

    let prompts = await Prompts.find(where)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean<PromptType[]>(); // ← این باعث میشه خروجی 100٪ تایپ باشه

    // -------------------------
    // ADD isFavorited LOGIC (MANUAL LOOKUP) 🚀
    // -------------------------
    if (favoriteId) {
      const promptIds = prompts.map((prompt) => prompt._id);

      // 3. Manually query the PromptFavorite collection
      const favoritedPrompts = await PromptFavorite.find({
        favoriteId: favoriteId,
        promptId: { $in: promptIds },
      })
        .select('promptId')
        .lean();

      // 4. Create a Set of favorited prompt IDs for O(1) lookup
      const favoritedPromptIds = new Set(
        favoritedPrompts.map((fav) => fav.promptId.toString())
      );

      // 5. Map over the prompts and add the isFavorited flag
      prompts = prompts.map((prompt) => ({
        ...prompt,
        isFavorited: favoritedPromptIds.has(prompt._id.toString()),
      })) as (PromptType & { isFavorited: boolean })[];
    }
    // -------------------------

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
