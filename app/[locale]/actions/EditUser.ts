'use server';

import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { EditRoleUserType } from '@/types/inputs/EditUser';
import { IUser } from '@/types/models';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { bustCache, CacheTags } from '@/lib/cache';

export async function EditRoleUser(userInput: EditRoleUserType) {
  try {
    const { userId: clerkId } = await auth();
    const client = await clerkClient();

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
          waitForAdmin: false,
        },
      }
    );

    const sessions = await client.sessions.getSessionList({
      userId: userEdited.clerkId,
    });

    await Promise.all(
      sessions.data.map((session) => client.sessions.revokeSession(session.id))
    );

    if (!userEdited) {
      throw new Error();
    }

    bustCache(CacheTags.users, CacheTags.admin);

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

export async function RejectRoleRequest(userId: string) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    await dbConnect();

    const admin = (await Users.findOne({ clerkId }).lean()) as IUser | null;
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return { status: false, message: 'dontAccess' };
    }

    await Users.findOneAndUpdate(
      { _id: userId },
      { $set: { waitForAdmin: false } }
    );

    bustCache(CacheTags.users, CacheTags.admin);

    return { status: true, message: 'rejectRoleRequest' };
  } catch (error) {
    return { status: false, message: 'generic' };
  }
}

export async function RequestRole() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    await dbConnect();

    const user = (await Users.findOne({ clerkId }).lean()) as IUser | null;
    if (!user) {
      return { status: false, message: 'userNotFound' };
    }

    if (user.role !== 'MEMBER') {
      return { status: false, message: 'dontAccess' };
    }

    const newWaitForAdmin = !user.waitForAdmin;

    await Users.findOneAndUpdate(
      { clerkId },
      { $set: { waitForAdmin: newWaitForAdmin } }
    );

    bustCache(CacheTags.users, CacheTags.admin);

    return {
      status: true,
      message: newWaitForAdmin ? 'requestRole' : 'cancelRequestRole',
    };
  } catch (error) {
    return { status: false, message: 'generic' };
  }
}
