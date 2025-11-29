'use server';

import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { revalidatePath } from 'next/cache';

export async function AddToFavorite({ promptId }: { promptId: string }) {
  try {
    console.log('Adding to favorite, promptId:', promptId);
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error('User not authenticated');

    await dbConnect();

    // پیدا کردن کاربر در MongoDB
    const user = await Users.findOne({ clerkId: clerkUserId });
    console.log('user:', user);
    if (!user) throw new Error('User not found');

    // پیدا کردن یا ایجاد Favorite document برای کاربر
    let favorite = await mongoose
      .model('Favorite')
      .findOne({ userId: user._id });

    if (!favorite) {
      favorite = await mongoose.model('Favorite').create({ userId: user._id });
    }

    const PromptFavorite = mongoose.model('PromptFavorite');

    // بررسی اینکه Prompt قبلاً favorited شده یا نه
    const existing = await PromptFavorite.findOne({
      favoriteId: favorite._id,
      promptId,
    });

    let action: 'added' | 'removed';

    if (existing) {
      await existing.deleteOne();
      action = 'removed';
    } else {
      await PromptFavorite.create({
        favoriteId: favorite._id,
        promptId,
      });
      action = 'added';
    }

    // Revalidate صفحات
    revalidatePath('/favorites');
    revalidatePath('/prompts');

    return {
      success: true,
      action,
      message:
        action === 'added'
          ? 'Added to favorites successfully'
          : 'Removed from favorites successfully',
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      action: null,
      message:
        error instanceof Error ? error.message : 'Failed to update favorites',
    };
  }
}

export async function RemoveFromFavorite({ promptId }: { promptId: string }) {
  // همون toggle logic، اگر موجود باشه حذف می‌کنه
  return AddToFavorite({ promptId });
}

export async function CheckIsFavorite({ promptId }: { promptId: string }) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return { isFavorite: false };

    await dbConnect();

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) return { isFavorite: false };

    const PromptFavorite = mongoose.model('PromptFavorite');

    const existing = await PromptFavorite.findOne({
      favoriteId: user._id,
      promptId,
    });

    return { isFavorite: !!existing };
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { isFavorite: false };
  }
}
