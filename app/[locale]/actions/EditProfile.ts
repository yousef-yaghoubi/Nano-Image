'use server';

import * as yup from 'yup';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { Users } from '@/models';
import { bustCache, CacheTags } from '@/lib/cache';
import {
  SchemaProfileEdit,
  SchemaImageUpdate,
  SchemaChangePassword,
} from '@/validation/Form';

type EditProfileInput = {
  firstName?: string | null;
  lastName?: string | null;
};

export async function EditProfile({ firstName, lastName }: EditProfileInput) {
  const clientClerk = await clerkClient();

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        status: false,
        message: 'isNotAuthenticated',
      };
    }

    const validated = await SchemaProfileEdit.validate({ firstName, lastName });

    // Prepare update object only with non-empty fields
    const finalValue: { firstName?: string; lastName?: string } = {};
    if (validated.firstName && validated.firstName.trim().length > 0)
      finalValue.firstName = validated.firstName.trim();
    if (validated.lastName && validated.lastName.trim().length > 0)
      finalValue.lastName = validated.lastName.trim();

    // Update user profile in Clerk
    const updatedUser = await clientClerk.users.updateUser(
      clerkUserId,
      finalValue
    );

    if (!updatedUser) {
      return {
        status: false,
        message: 'generic',
      };
    }

    return {
      status: true,
      message: 'profileUpdated',
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: false, message: error.message };
    }
    console.error('EditProfile error:', error);
    return {
      status: false,
      message: 'generic',
    };
  }
}

export async function AddImage({ file }: { file: File | Blob }) {
  const clientClerk = await clerkClient();

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        status: false,
        message: 'isNotAuthenticated',
      };
    }

    await SchemaImageUpdate.validate({ file });

    // Send file to Clerk as profile image
    const updatedUser = await clientClerk.users.updateUserProfileImage(
      clerkUserId,
      {
        file,
      }
    );

    if (!updatedUser) {
      return {
        status: false,
        message: 'generic',
      };
    }

    await Users.findOneAndUpdate(
      {
        clerkId: clerkUserId,
      },

      {
        $set: {
          image: updatedUser.imageUrl,
        },
      }
    );

    // Revalidate profile pages to refresh the avatar
    bustCache(CacheTags.users);

    return {
      status: true,
      message: 'imageUpdated',
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: false, message: error.message };
    }
    return {
      status: false,
      message: 'generic',
    };
  }
}

export async function ChangePassword({
  newPassword,
  confirmPassword,
}: {
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    const passwordValidated = await SchemaChangePassword.validate({
      newPassword,
      confirmPassword,
    });

    const clientClerk = await clerkClient();
    const user = await clientClerk.users.getUser(clerkUserId);

    if (user.passwordEnabled === false) {
      return { status: false, message: 'passwordNotEnabled' };
    }

    await clientClerk.users.updateUser(clerkUserId, {
      password: passwordValidated.newPassword,
    });

    return { status: true, message: 'passwordChanged' };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: false, message: error.message };
    }
    return { status: false, message: 'generic' };
  }
}
