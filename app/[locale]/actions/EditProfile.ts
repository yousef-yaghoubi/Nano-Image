'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { Users } from '@/models';
import { bustCache, CacheTags } from '@/lib/cache';

type EditProfileInput = {
  firstName?: string | null;
  lastName?: string | null;
};

export async function EditProfile({ firstName, lastName }: EditProfileInput) {
  const t = await getTranslations('Messages');
  const clientClerk = await clerkClient();

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        status: false,
        message: t('isNotAuthenticated'),
      };
    }

    // Prepare update object only with non-empty fields
    const finalValue: { firstName?: string; lastName?: string } = {};
    if (firstName && firstName.trim().length > 0)
      finalValue.firstName = firstName.trim();
    if (lastName && lastName.trim().length > 0)
      finalValue.lastName = lastName.trim();

    // Update user profile in Clerk
    const updatedUser = await clientClerk.users.updateUser(
      clerkUserId,
      finalValue
    );

    if (!updatedUser) {
      return {
        status: false,
        message: t('generic'),
      };
    }

    return {
      status: true,
      message: t('profileUpdated'),
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    console.error('EditProfile error:', error);
    return {
      status: false,
      message: t('generic'),
    };
  }
}

export async function AddImage({ file }: { file: File | Blob }) {
  const clientClerk = await clerkClient();
  const t = await getTranslations('Messages');

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return {
        status: false,
        message: t('isNotAuthenticated'),
      };
    }

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
        message: t('generic'),
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
      message: t('imageUpdated'),
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return {
      status: false,
      message: t('generic'),
    };
  }
}
