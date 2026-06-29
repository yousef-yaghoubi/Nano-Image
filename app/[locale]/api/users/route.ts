import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { UserType } from '@/types/data';
import type { FilterQuery, SortOrder } from 'mongoose';
import { usersQuerySchema } from '@/validation/DTO';
import { CacheTags, cacheLife, cacheTag } from '@/lib/cache';

/**
 * Cached function that fetches paginated users with filters.
 */
const getCachedUsers = async (
  page: number,
  limit: number,
  sortParam: string,
  search: string | undefined,
  role: string | undefined
) => {
  'use cache';
  cacheTag(CacheTags.users);
  cacheLife('weeks');

  await dbConnect();

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

  const [total, usersRaw] = await Promise.all([
    Users.countDocuments(where),
    Users.find(where).sort(sort).skip(skip).limit(limit).lean<UserType[]>(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: JSON.parse(JSON.stringify(usersRaw)),
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

    const result = await getCachedUsers(
      page,
      limit,
      sortParam ?? 'firstName asc',
      search ?? undefined,
      role ?? undefined
    );

    return NextResponse.json({
      success: true,
      message: 'users fetched successfully',
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
