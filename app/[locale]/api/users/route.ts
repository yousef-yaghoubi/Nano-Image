import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { UserType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { usersQuerySchema } from '@/validation/DTO';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    let validatedData;
    try {
      validatedData = await usersQuerySchema.validate({
        page: searchParams.get('page'),
        limit: searchParams.get('limit'),
        sort: searchParams.get('sort'),
        search: searchParams.get('search'),
        role: searchParams.get('role'),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown validation error';
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { page, limit, sort: sortParam, search, role } = validatedData;
    const skip = (page - 1) * limit;

    const where: FilterQuery<UserType> = {};

    if (search) {
      where.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      where.role = role;
    }

    const sort: Record<string, SortOrder> = {};
    if (sortParam === 'firstName asc') sort.firstName = 1;
    else if (sortParam === 'createdAt desc') sort.createdAt = -1;
    else if (sortParam === 'createdAt asc') sort.createdAt = 1;
    else if (sortParam === 'lastName desc') sort.lastName = -1;
    else if (sortParam === 'lastName asc') sort.lastName = 1;
    else sort.firstName = -1;

    console.log('sort', sort);
    const [total, usersRaw] = await Promise.all([
      Users.countDocuments(where),
      Users.find(where).sort(sort).skip(skip).limit(limit).lean<UserType[]>(),
    ]);

    let users = usersRaw;

    // if (favoriteId && users.length > 0) {
    //   const promptIds = users.map((p) => p._id);
    //   const favoritedEntries = await PromptFavorite.find({
    //     favoriteId,
    //     promptId: { $in: promptIds },
    //   })
    //     .select('promptId')
    //     .lean();

    //   const favoritedSet = new Set(
    //     favoritedEntries.map((f) => f.promptId.toString())
    //   );

    //   users = users.map((p) => ({
    //     ...p,
    //     isFavorited: favoritedSet.has(p._id.toString()),
    //   })) as typeof usersRaw;
    // }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: 'users fetched successfully',
      data: users,
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

// export async function DELETE(req: Request) {
//   const { promptId } = await req.json();

//   try {
//     const { userId: clerkUserId } = await auth();
//     if (!clerkUserId) {
//       return NextResponse.json({ success: false, message: 'Unauthorized' });
//     }

//     await dbConnect();

//     const user = await Users.findOne({ clerkId: clerkUserId });
//     if (!user) {
//       return NextResponse.json({
//         success: false,
//         message: 'isNotAuthenticated',
//       });
//     }

//     const prompt = await Prompts.findById(promptId);
//     if (!prompt) {
//       return NextResponse.json({ success: false, message: 'Prompt not found' });
//     }

//     if (user._id.toString() !== prompt.creatorId.toString()) {
//       return NextResponse.json({ success: false, message: 'Unauthorized' });
//     }

//     await Prompts.findByIdAndDelete(promptId);
//     revalidateTag('prompts', 'max');

//     return NextResponse.json({
//       success: true,
//       message: 'Prompt deleted successfully',
//     });
//   } catch (error) {
//     console.error('Delete prompt error:', error);
//     return NextResponse.json({ success: false, message: 'Prompt not found' });
//   }
// }
