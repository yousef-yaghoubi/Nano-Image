import dbConnect from '@/lib/db';
import { Favorite, Prompts, Users, PromptFavorite } from '@/models';
import { NextResponse } from 'next/server';
import type { FilterQuery, SortOrder } from 'mongoose';
import { PromptType } from '@/types/data';
import { ObjectId } from 'mongodb';
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
    const { userId: clerkId } = await auth();
    let userId: ObjectId | null = null;
    let favoriteId: ObjectId | null = null;

    if (!clerkId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not authenticated',
          data: null,
        },
        { status: 401 }
      );
    }

    const user = await Users.findOne({ clerkId })
      .select('_id')
      .lean<IUser | null>();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found in database',
          data: null,
        },
        { status: 404 }
      );
    }

    userId = user._id;

    const favoriteDoc = await Favorite.findOne({ userId: userId })
      .select('_id')
      .lean<IFavorite | null>();

    if (favoriteDoc) {
      favoriteId = favoriteDoc._id;
    }

    // -------------------------
    // TAGS
    // -------------------------
    let tags: string[] | null = null;
    if (rawTags && rawTags.trim() && rawTags !== 'undefined') {
      tags = rawTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
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
    // FILTER — only prompts created by user
    // -------------------------
    const where: FilterQuery<PromptType> = {
      creatorId: userId, // Only show prompts created by the authenticated user
    };

    if (tags) where.tags = { $in: tags };

    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } },
      ];
    }

    // -------------------------
    // SORT
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
        sort.createdAt = -1;
    }

    // -------------------------
    // QUERY
    // -------------------------
    const total = await Prompts.countDocuments(where);

    let prompts = await Prompts.find(where)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean<PromptType[]>();

    // -------------------------
    // ADD isFavorited
    // -------------------------
    if (favoriteId && prompts.length > 0) {
      const promptIds = prompts.map((p) => p._id);

      const favorited = await PromptFavorite.find({
        favoriteId,
        promptId: { $in: promptIds },
      })
        .select('promptId')
        .lean();

      const favSet = new Set(favorited.map((f) => f.promptId.toString()));

      prompts = prompts.map((p) => ({
        ...p,
        isFavorited: favSet.has(p._id.toString()),
      }));
    }

    // -------------------------
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'User prompts fetched successfully 🚀',
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
        message: 'Error fetching user prompts',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      },
      { status: 500 }
    );
  }
}
