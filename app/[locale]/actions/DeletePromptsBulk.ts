'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { bustCache, CacheTags } from '@/lib/cache';

export async function DeletePromptsBulk({
  promptIds,
}: {
  promptIds: string[];
}) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: 'isNotAuthenticated' };
    }

    if (!promptIds.length) {
      return { success: false, message: 'generic' };
    }

    await dbConnect();

    const user = await Users.findOne({ clerkId: clerkUserId });
    if (!user) {
      return { success: false, message: 'isNotAuthenticated' };
    }

    await Prompts.deleteMany({ _id: { $in: promptIds } });

    bustCache(CacheTags.prompts, CacheTags.admin, CacheTags.quantities);

    return {
      success: true,
      message: 'deletePrompt',
      count: promptIds.length,
    };
  } catch {
    return { success: false, message: 'generic' };
  }
}
