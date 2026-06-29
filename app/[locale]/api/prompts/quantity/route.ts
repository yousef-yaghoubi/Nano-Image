import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Prompts } from '@/models';
import { cacheLife, cacheTag } from 'next/cache';
import { CacheTags } from '@/lib/cache';

 

const getCachedQuantities = async () => {
  'use cache';

  cacheTag(CacheTags.quantities);
  cacheLife('weeks');

  await dbConnect();

  const promptsQuantity = await Prompts.countDocuments();

  const likesResult = await Prompts.aggregate([
    {
      $group: {
        _id: null,
        totalLikes: { $sum: '$likes' },
      },
    },
  ]);

  const likePromptsQuantity = likesResult[0]?.totalLikes || 0;

  return {
    prompts: Math.floor(promptsQuantity / 10) * 10,
    likes: Math.floor(likePromptsQuantity / 100) * 100,
  };
};

export async function GET() {
  try {
    const data = await getCachedQuantities();

    return NextResponse.json({
      success: true,
      message: null,
      data,
    });
  } catch (error) {
    console.error('Error fetching prompts quantity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching prompts quantity',
        data: null,
      },
      { status: 500 }
    );
  }
}
