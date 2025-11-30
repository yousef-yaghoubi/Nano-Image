import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import dbConnect from '@/lib/db';
import { Favorite, Users, PromptFavorite } from '@/models';
import { IFavorite, IUser } from '@/types/models';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Database Connection and Authentication
    await dbConnect();
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const { userId: clerkUserId } = await auth(); // Using auth() without await based on context

    if (!clerkUserId) {
      return NextResponse.json(
      { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // find app user
    const user = (await Users.findOne({
      clerkId: clerkUserId,
    }).lean()) as IUser | null;
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // 2. Pagination Setup
    const limit = Math.max(1, Number(searchParams.get('limit')) || 24);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    // 3. Sorting Setup
    const sortParam = searchParams.get('sort');
    // Default: date desc (by when it was favorited)
    let sort: { [key: string]: 1 | -1 } = { 'prompt.likes': -1 };

    // Flag to check if sorting by a field on the 'Prompt' document
    let isSortingByPromptField = true;

    switch (sortParam) {
      case 'likes asc':
        sort = { 'prompt.likes': 1 };
        isSortingByPromptField = true;
        break;
      case 'likes desc':
        sort = { 'prompt.likes': -1 };
        isSortingByPromptField = true;
        break;
      case 'date asc':
        // Sort by the favorite creation date directly on PromptFavorite
        sort = { createdAt: 1 };
        isSortingByPromptField = false; // Added to correctly use the sort stage
        break;
      case 'date desc':
        // Sort by the favorite creation date directly on PromptFavorite
        sort = { createdAt: -1 };
        isSortingByPromptField = false; // Added to correctly use the sort stage
        break;
    }

    // 4. Fetch Favorite Container
    const favorite = (await Favorite.findOne({
      userId: user._id,
    }).lean()) as IFavorite | null;
    if (!favorite) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: page,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }

    // 5. Aggregation Pipeline
    const pipeline = [
      { $match: { favoriteId: favorite._id } },

      // Stage A: Sort by field on PromptFavorite (e.g., 'createdAt') before $lookup for efficiency
      // Only include this stage if we are NOT sorting by a prompt field.
      ...(!isSortingByPromptField ? [{ $sort: sort }] : []),

      {
        $lookup: {
          from: 'prompts',
          localField: 'promptId',
          foreignField: '_id',
          as: 'prompt',
        },
      },
      // Remove entries where the prompt was deleted (prompt array is empty)
      { $unwind: '$prompt' },

      // Stage B: Sort by field on the Prompts document (e.g., 'prompt.likes') after $unwind
      // Only include this stage if we ARE sorting by a prompt field.
      ...(isSortingByPromptField ? [{ $sort: sort }] : []),

      // Pagination must happen AFTER sorting
      { $skip: (page - 1) * limit },
      { $limit: limit },

      // 🛑 FIXED: Project the prompt object and add the isFavorited: true flag
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$prompt',
              { isFavorited: true }, // 🛑 Add the constant isFavorited: true field
            ],
          },
        },
      },
    ];

    const data = await PromptFavorite.aggregate(pipeline);

    // 6. Get Total Count
    // This pipeline correctly excludes deleted prompts for accurate total count
    const totalCountPipeline = [
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
    ];

    const totalObj = await PromptFavorite.aggregate(totalCountPipeline);
    const total = totalObj[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // 7. Return Response
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching favorite prompts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching favorite prompts',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
