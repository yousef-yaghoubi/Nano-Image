'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { bustCache, CacheTags } from '@/lib/cache';

export async function UpdatePromptsStatusBulk({
  promptIds,
  value,
}: {
  promptIds: string[];
  value: 'True' | 'False';
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

    await Prompts.updateMany(
      { _id: { $in: promptIds } },
      { $set: { status: value } }
    );

    bustCache(CacheTags.prompts, CacheTags.admin);

    return {
      success: true,
      message: 'editStatus',
      count: promptIds.length,
    };
  } catch {
    return { success: false, message: 'generic' };
  }
}
