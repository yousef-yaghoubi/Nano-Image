import { prisma } from '@/prisma/prismaClient';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get('limit')) || 24;
  const page = Number(searchParams.get('page')) || 1;

  const rawTags = searchParams.get('tags');

  let tags: string[] | null = null;

  // prevent tags 'undefined' or empty
  if (rawTags && rawTags !== 'undefined' && rawTags.trim() !== '') {
    tags = rawTags.split(',');
  }

  const searchRaw = searchParams.get('search');
  const search =
    searchRaw && searchRaw !== 'undefined' && searchRaw.trim() !== ''
      ? searchRaw
      : null;

  const skip = (page - 1) * limit;

  try {
    const where: Prisma.PromptsWhereInput = { isPremium: false };

    // filter tags only when real tags exist
    if (tags) {
      where.tags = { hasSome: tags };
    }

    // filter search only when search is real text
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { prompt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.prompts.count({ where });

    const prompts = await prisma.prompts.findMany({
      take: limit,
      skip,
      where,
    });

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
    return NextResponse.json({
      success: false,
      message: 'Error fetching prompts',
      error,
      data: null,
      pagination: null,
    });
  }
}
