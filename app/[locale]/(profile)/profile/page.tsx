import FormUpdateUser from '@/components/pages/profile/FormUpdateUser';
import UpdateImage from '@/components/pages/profile/UpdateImage';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Pages.Profile');

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="backgroundSecond rounded-3xl border border-gray-300 p-5 shadow-xl dark:border-gray-700">
        <h3 className="heading-3 mb-3">{t('Rename.title')}</h3>
        <FormUpdateUser />
      </div>
      <div className="backgroundSecond rounded-3xl border border-gray-300 p-5 shadow-xl dark:border-gray-700">
        <h3 className="heading-3 mb-3">{t('Image.title')}</h3>
        <UpdateImage />
      </div>
    </div>
  );
}
