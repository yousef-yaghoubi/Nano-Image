'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { bustCache, CacheTags } from '@/lib/cache';

export async function DeletePrompt({ promptId }: { promptId: string }) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: 'isNotAuthenticated' };
    }

    await dbConnect();

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) {
      return { success: false, message: 'isNotAuthenticated' };
    }

    const prompt = await Prompts.findById(promptId);
    if (!prompt) {
      return { success: false, message: 'notFound' };
    }

    if (user._id.toString() !== prompt.creatorId.toString()) {
      return { success: false, message: 'dontAccess' };
    }

    await Prompts.findByIdAndDelete(promptId);

    bustCache(CacheTags.prompts, CacheTags.admin);

    return { success: true, message: 'deletePrompt' };
  } catch {
    return { success: false, message: 'generic' };
  }
}
