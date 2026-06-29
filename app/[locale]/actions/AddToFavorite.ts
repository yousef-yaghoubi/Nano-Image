'use server';

import { auth } from '@clerk/nextjs/server';
import mongoose, { ObjectId } from 'mongoose';
import dbConnect from '@/lib/db';
import { Users, Prompts } from '@/models';
import { getTranslations } from 'next-intl/server';
import { bustCache, CacheTags } from '@/lib/cache';

export async function AddToFavorite({ promptId }: { promptId: ObjectId }) {
  const t = await getTranslations('Messages');

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        success: false,
        action: null,
        message: t('isNotAuthenticated'),
      };
    }

    await dbConnect();

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) {
      return {
        success: false,
        action: null,
        message: t('userNotFound'),
      };
    }

    let favorite = await mongoose
      .model('Favorite')
      .findOne({ userId: user._id });

    if (!favorite) {
      favorite = await mongoose.model('Favorite').create({ userId: user._id });
    }

    const PromptFavorite = mongoose.model('PromptFavorite');

    const existing = await PromptFavorite.findOne({
      favoriteId: favorite._id,
      promptId,
    });

    let action: 'added' | 'removed';
    let updateValue: 1 | -1;

    if (existing) {
      await existing.deleteOne();
      action = 'removed';
      updateValue = -1;
    } else {
      await PromptFavorite.create({
        favoriteId: favorite._id,
        promptId,
      });
      action = 'added';
      updateValue = 1;
    }

    await Prompts.findByIdAndUpdate(
      promptId,
      { $inc: { likes: updateValue } },
      { new: true }
    );

    bustCache(CacheTags.favorites, CacheTags.prompts);

    return {
      success: true,
      action,
      message:
        action === 'added' ? t('addToFavorite') : t('removeFromFavorite'),
    };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      action: null,
      message: t('generic'),
    };
  }
}
