import NotAuthenticated from '@/components/shared/NotAuthenticated';
import SendPrompt from '@/components/shared/SendPrompt';
import { auth } from '@clerk/nextjs/server';

async function page() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  // const publicMetadata =
  //   sessionClaims?.public_metadata as SessionPublicMetadata;

  return (
    <>
      <SendPrompt />
    </>
  );
}

export default page;
