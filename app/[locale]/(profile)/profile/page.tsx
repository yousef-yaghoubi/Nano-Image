import FormUpdateUser from '@/components/shared/UpdateProfile/FormUpdateUser';
import UpdateImage from '@/components/shared/UpdateProfile/UpdateImage';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Pages.Profile');

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="border p-5 rounded-3xl border-gray-300 dark:border-gray-700 shadow-xl backgroundSecond">
        <h3 className="heading-3 mb-3">{t('Rename.title')}</h3>
        <FormUpdateUser />
      </div>
      <div className="border p-5 rounded-3xl border-gray-300 dark:border-gray-700 shadow-xl backgroundSecond">
        <h3 className="heading-3 mb-3">{t('Image.title')}</h3>
        <UpdateImage />
      </div>
    </div>
  );
}
