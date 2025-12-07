'use server';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { IUser } from '@/types/models';

interface AddPromptInput {
  clerkId: string;
  prompt: {
    title: string;
    prompt: string; // required - updated model
    image: string;
    tags?: string[];
  };
}

export async function AddPrompt({ clerkId, prompt }: AddPromptInput) {
  try {
    console.log('clerkId', clerkId);
    if (!clerkId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    await dbConnect();

    const user = (await Users.findOne({ clerkId }).lean()) as IUser | null;

    console.log('user:', user);
    if (!user) {
      return { status: false, message: 'userNotFound' };
    }

    const newPrompt = await Prompts.create({
      title: prompt.title,
      prompt: prompt.prompt,
      image: prompt.image,
      creatorId: user._id,
      tags: prompt.tags || [],
      isPublic: false,
    });

    return {
      status: true,
      message: 'createPrompt',
      data: JSON.parse(JSON.stringify(newPrompt)),
    };
  } catch (error) {
    console.log('AddPrompt error:', error);
    return { status: false, message: 'generic' };
  }
}
