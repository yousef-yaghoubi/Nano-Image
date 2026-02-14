import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Prompts } from '@/models';

export async function GET() {
  try {
    await dbConnect();

    // Count total prompts
    const promptsQuantity = await Prompts.countDocuments();

    // Sum all likes from prompts
    const likesResult = await Prompts.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: '$likes' },
        },
      },
    ]);

    const likePromptsQuantity = likesResult[0]?.totalLikes || 0;

    return NextResponse.json({
      success: true,
      message: null,
      data: {
        prompts: Math.floor(promptsQuantity / 10) * 10,
        likes: Math.floor(likePromptsQuantity / 100) * 100,
      },
    });
  } catch (error) {
    console.error('Error fetching prompts quantity:', error);
    return NextResponse.json(
      // {success: true,
      // message: null,
      // data: {
      //   prompts: 874,
      //   likes: 3054,
      // }}
      {
        success: false,
        message: 'Error fetching prompts quantity',
        data: null,
      },
      { status: 500 }
    );
  }
}
