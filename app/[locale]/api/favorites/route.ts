import dbConnect from '@/lib/db';
import { Favorite, Users, PromptFavorite } from '@/models';
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const { userId: clerkUserId } = await auth();
    const userClerk = await currentUser();

    console.log(userClerk);
    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // find app user
    const user = await Users.findOne({ clerkId: clerkUserId }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Pagination
    const limit = Math.max(1, Number(searchParams.get('limit')) || 24);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    // Sorting
    const sortParam = searchParams.get('sort');
    let sortBy = 'createdAt';
    let sortOrder: 1 | -1 = -1;

    switch (sortParam) {
      case 'likes asc':
        sortBy = 'likes';
        sortOrder = 1;
        break;
      case 'likes desc':
        sortBy = 'likes';
        sortOrder = -1;
        break;
      case 'date asc':
        sortBy = 'createdAt';
        sortOrder = 1;
        break;
      case 'date desc':
        sortBy = 'createdAt';
        sortOrder = -1;
        break;
    }

    // get favorite container
    const favorite = await Favorite.findOne({ userId: user._id }).lean();
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

    // aggregation pipeline for real sorting
    const pipeline = [
      { $match: { favoriteId: favorite._id } },

      {
        $lookup: {
          from: 'prompts',
          localField: 'promptId',
          foreignField: '_id',
          as: 'prompt',
        },
      },

      // remove deleted prompts
      { $unwind: '$prompt' },

      // sorting
      { $sort: { [`prompt.${sortBy}`]: sortOrder } },

      // pagination
      { $skip: (page - 1) * limit },
      { $limit: limit },

      // project only prompt object
      { $replaceRoot: { newRoot: '$prompt' } },
    ];

    const data = await PromptFavorite.aggregate(pipeline);

    // get correct total count (excluding deleted prompts)
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
