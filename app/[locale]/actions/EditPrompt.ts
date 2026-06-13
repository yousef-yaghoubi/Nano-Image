'use server';

import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { IUser } from '@/types/models';

interface EditPromptInput {
  clerkId: string;
  prompt: {
    id: string;
    title?: string;
    prompt?: string;
  };
}

export async function EditPrompt({ clerkId, prompt }: EditPromptInput) {
  try {
    if (!clerkId) {
      return {
        status: false,
        message: 'isNotAuthenticated',
      };
    }

    if (!prompt.id) {
      return {
        status: false,
        message: 'promptIdRequired',
      };
    }

    await dbConnect();

    const user = (await Users.findOne({
      clerkId,
    }).lean()) as IUser | null;

    if (!user) {
      return {
        status: false,
        message: 'userNotFound',
      };
    }

    const finalValue: { title?: string; prompt?: string } = {};
    if (prompt.title && prompt.title.trim().length > 0)
      finalValue.title = prompt.title.trim();
    if (prompt.prompt && prompt.prompt.trim().length > 0)
      finalValue.prompt = prompt.prompt.trim();

    const editedPrompt = await Prompts.findOneAndUpdate(
      {
        _id: prompt.id,
        creatorId: user._id,
      },
      {
        $set: {
          ...finalValue,
          isPublic: 'Pending',
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!editedPrompt) {
      return {
        status: false,
        message: 'promptNotFound',
      };
    }

    return {
      status: true,
      message: 'editPrompt',
      data: JSON.parse(JSON.stringify(editedPrompt)),
    };
  } catch (error) {
    console.error('EditPrompt error:', error);

    return {
      status: false,
      message: 'generic',
    };
  }
}
