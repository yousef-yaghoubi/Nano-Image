import dynamic from 'next/dynamic';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { Users } from '@/models';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import type { IUser } from '@/types/models';

const RequestRoleClient = dynamic(
  () => import('@/components/pages/profile/requestRole/RequestRoleClient')
);

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
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <RequestRoleClient
        role={role}
        waitForAdmin={user?.waitForAdmin === true}
      />
    </MotionDiv>
  );
}

export default page;
