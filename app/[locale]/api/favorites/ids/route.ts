import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Favorite, PromptFavorite, Users } from '@/models';
import { IFavorite, IUser } from '@/types/models';
import { CacheTags, cacheLife, cacheTag } from '@/lib/cache';

const getCachedFavoriteIds = async (userId: string) => {
  'use cache';
  cacheTag(CacheTags.favorites);
  cacheLife('weeks');

  await dbConnect();

  const favDoc = (await Favorite.findOne({ userId })
    .select('_id')
    .lean()) as IFavorite | null;

  if (!favDoc) return [];

  const entries = await PromptFavorite.find({ favoriteId: favDoc._id })
    .select('promptId -_id')
    .lean();

  return entries.map((e) => e.promptId.toString());
};

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({
        success: true,
        data: { promptIds: [] },
      });
    }

    await dbConnect();
    const user = await Users.findOne({ clerkId })
      .select('_id')
      .lean<IUser | null>();

    if (!user) {
      return NextResponse.json({
        success: true,
        data: { promptIds: [] },
      });
    }

    const promptIds = await getCachedFavoriteIds(user._id.toString());

    return NextResponse.json({
      success: true,
      data: { promptIds },
    });
  } catch (error) {
    console.error('Fetch favorite IDs error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
