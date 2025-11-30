'use server';

import { auth } from '@clerk/nextjs/server';
import mongoose, { ObjectId } from 'mongoose';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
// ** Import your Prompt model here **
import { Prompts } from '@/models'; // Assuming you have a Prompt model
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

export async function AddToFavorite({ promptId }: { promptId: ObjectId }) {
  const t = await getTranslations('Errors');
  try {
    console.log('Adding to favorite, promptId:', promptId);
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return {
        success: false,
        action: null,
        message: t('isNotAuthenticated'),
      };

    await dbConnect();

    // پیدا کردن کاربر در MongoDB
    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user)
      return {
        success: false,
        action: null,
        message: t('userNotFound'),
      };

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
    let updateValue: 1 | -1;

    if (existing) {
      // ** REMOVE from favorites **
      await existing.deleteOne();
      action = 'removed';
      updateValue = -1; // Decrement the count
    } else {
      // ** ADD to favorites **
      await PromptFavorite.create({
        favoriteId: favorite._id,
        promptId,
      });
      action = 'added';
      updateValue = 1; // Increment the count
    }

    // --- ** CORE CHANGE: Update Prompt's favoritesCount ** ---

    // ** 2. Use the imported Prompt model to update the count **
    const updatedPrompt = await Prompts.findByIdAndUpdate(
      promptId,
      // ** اصلاح شده: استفاده از 'likes' به جای 'favoritesCount' **
      { $inc: { likes: updateValue } }, // Atomically increment/decrement 'likes'
      { new: true } // Return the updated document
    );

    if (!updatedPrompt) {
      // ... (این بخش ثابت می‌ماند)
      console.warn(`Prompt with ID ${promptId} not found for count update.`);
    } else {
      // ** اصلاح شده: لاگ کردن تعداد 'likes' **
      console.log(
        `Prompt ${promptId} likes count updated by ${updateValue}. New count: ${updatedPrompt.likes}`
      );
    }
    // -------------------------------------------------------------------

    // Revalidate صفحات
    revalidatePath('/favorites');
    revalidatePath('/prompts');

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
