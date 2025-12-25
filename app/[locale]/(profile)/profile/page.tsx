import FormUpdateUser from '@/components/shared/UpdateProfile/FormUpdateUser';
import UpdateImage from '@/components/shared/UpdateProfile/UpdateImage';
import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function Page() {
  const user = await currentUser();
  const t = await getTranslations('Pages.Profile');

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col items-center gap-3">
        <Image
          alt="user image"
          src={user?.imageUrl || '/placeholder-avatar.jpg'}
          width={250}
          height={250}
          className="rounded-full ring-4 ring-primary p-2 w-64 h-64"
        />
        <h3 className="heading-5">{user?.fullName ?? ''}</h3>
        <h3 className="heading-5">
          {user?.emailAddresses?.[0]?.emailAddress ?? ''}
        </h3>
      </div>
      <div className="flex flex-col w-3/4 gap-10">
        <div>
          <h3 className="heading-3 mb-3">{t('Rename.title')}</h3>
          <FormUpdateUser />
        </div>
        <div>
          <h3 className="heading-3 mb-3">{t('Image.title')}</h3>
          <UpdateImage />
        </div>
      </div>
    </div>
  );
}
