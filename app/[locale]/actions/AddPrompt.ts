'use server';

import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { IUser } from '@/types/models';

interface AddPromptInput {
  clerkId: string;
  prompt: {
    title: string;
    prompt: string;
    image: string;
    tags?: string[];
  };
}

export async function AddPrompt({ clerkId, prompt }: AddPromptInput) {
  try {
    if (!clerkId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    await dbConnect();

    const user = (await Users.findOne({ clerkId }).lean()) as IUser | null;
    if (!user) {
      return { status: false, message: 'userNotFound' };
    }

    const newPrompt = await Prompts.create({
      title: prompt.title,
      prompt: prompt.prompt,
      image: prompt.image,
      creatorId: user._id,
      tags: prompt.tags || [],
      isPublic: 'Pending',
    });

    return {
      status: true,
      message: 'createPrompt',
      data: JSON.parse(JSON.stringify(newPrompt)),
    };
  } catch (error) {
    console.error('AddPrompt error:', error);
    return { status: false, message: 'generic' };
  }
}
