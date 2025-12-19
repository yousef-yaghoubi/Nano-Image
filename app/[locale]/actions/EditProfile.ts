'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';

interface EditProfileInput {
  firstName: string;
  lastName: string;
  email: string;
}

export async function EditProfile({
  firstName,
  lastName,
  email,
}: EditProfileInput) {
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
    const finalValue: Partial<EditProfileInput> = {};
    if (firstName && firstName.trim().length > 0)
      finalValue.firstName = firstName.trim();
    if (lastName && lastName.trim().length > 0)
      finalValue.lastName = lastName.trim();
    if (email && email.trim().length > 0) finalValue.email = email.trim();

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

    // Revalidate profile pages
    revalidatePath('/fa/profile');
    revalidatePath('/en/profile');

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
    const updatedUser = await clientClerk.users.updateUserProfileImage(clerkUserId, {
      file,
    });

    if (!updatedUser) {
      return {
        status: false,
        message: t('generic'),
      };
    }

    return {
      status: true,
      message: t('profileImageUpdated'),
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    console.error('AddImage error:', error);
    return {
      status: false,
      message: t('generic'),
    };
  }
}
