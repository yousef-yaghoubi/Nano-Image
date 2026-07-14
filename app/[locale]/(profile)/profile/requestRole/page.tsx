import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
import RequestRoleClient from './RequestRoleClient';
import { IUser } from '@/types/models';

async function page() {
  const { sessionClaims, userId } = await auth();
  if (!userId) redirect('/');

  const role = (
    sessionClaims?.public_metadata as SessionPublicMetadata | undefined
  )?.role;

  if (!role) redirect('/');

  await dbConnect();
  const user = (await Users.findOne({ clerkId: userId })
    .select('waitForAdmin')
    .lean()) as IUser;

  return (
    <RequestRoleClient
      role={role}
      waitForAdmin={user?.waitForAdmin === true}
    />
  );
}

export default page;
