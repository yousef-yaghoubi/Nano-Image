import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { NextResponse } from 'next/server';
import type { FilterQuery, SortOrder } from 'mongoose';
import { PromptType } from '@/types/data';
import { auth } from '@clerk/nextjs/server';
import { IUser } from '@/types/models';
import { promptsQuerySchema } from '@/validation/DTO';

// export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    // ۱. اعتبارسنجی ورودی‌ها با DTO
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
    } = validatedData;

    // ۲. احراز هویت (اجباری برای این مسیر)
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const user = await Users.findOne({ clerkId })
      .select('_id')
      .lean<IUser | null>();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // ۴. فیلتر (فقط پرامپت‌های خود کاربر)
    const where: FilterQuery<PromptType> = {
      creatorId: user._id,
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

    // ۵. تنظیم سورت
    const sort: Record<string, SortOrder> = {};
    if (sortParam === 'likes desc') sort.likes = -1;
    else if (sortParam === 'likes asc') sort.likes = 1;
    else if (sortParam === 'date asc') sort.createdAt = 1;
    else sort.createdAt = -1; // Default: date desc

    // ۶. کوئری دیتابیس (اجرا به صورت موازی برای سرعت بیشتر)
    const skip = (page - 1) * limit;
    const [total, promptsRaw] = await Promise.all([
      Prompts.countDocuments(where),
      Prompts.find(where)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<PromptType[]>(),
    ]);

    let prompts = promptsRaw;
    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      success: true,
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
    console.error('Error fetching user prompts:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching user prompts' },
      { status: 500 }
    );
  }
}
