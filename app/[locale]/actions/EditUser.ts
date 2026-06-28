'use server';

import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { EditRoleUserType } from '@/types/inputs/EditUser';
import { IUser } from '@/types/models';
import { auth } from '@clerk/nextjs/server';

export async function EditRoleUser(userInput: EditRoleUserType) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        status: false,
        message: 'isNotAuthenticated',
      };
    }

    if (!userInput.userId) {
      return {
        status: false,
        message: 'userNotFound',
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

    if (user.role !== 'SUPER_ADMIN') {
      return {
        status: false,
        message: 'dontAccess',
      };
    }

    const userEdited = await Users.findOneAndUpdate(
      {
        _id: userInput.userId,
      },
      {
        $set: {
          role: userInput.value,
        },
      }
    );

    if (!userEdited) {
      throw new Error();
    }

    return {
      status: true,
      message: 'editRole',
    };
  } catch (error) {
    return {
      status: false,
      message: 'generic',
    };
  }
}
