import NotAuthenticated from '@/components/shared/NotAuthenticated';
import TeaxtArea from '@/components/shared/TextArea';
import UploadImage from '@/components/shared/UploadImage';
import { auth } from '@clerk/nextjs/server';

async function page() {
  const { isAuthenticated, sessionClaims } = await auth();

  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  const publicMetadata =
    sessionClaims?.public_metadata as SessionPublicMetadata;
  console.log('publicMetadata: ', publicMetadata.role);

  if (
    publicMetadata.role !== 'ADMIN' &&
    publicMetadata.role !== 'SUPER_ADMIN'
  ) {
    return <div>You are a {publicMetadata.role || 'MEMBER'}</div>;
  }

  return (
    <div>
      <UploadImage/>
      <TeaxtArea />
    </div>
  );
}

export default page;
