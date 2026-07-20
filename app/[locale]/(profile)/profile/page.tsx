import FormUpdateUser from '@/components/pages/profile/FormUpdateUser';
import Head3Client from '@/components/pages/profile/Head3Client';
import UpdateImage from '@/components/pages/profile/UpdateImage';
import UpdatePassword from '@/components/pages/profile/UpdatePassword';
import { MotionDiv, staggerContainer, staggerItem } from '@/components/shared/MotionWarpper';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Pages.Profile');

  const sections = [
    { title: t('Rename.title'), component: <FormUpdateUser /> },
    { title: t('Password.title'), component: <UpdatePassword /> },
    { title: t('Image.title'), component: <UpdateImage /> },
  ];

  return (
    <MotionDiv variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
      <MotionDiv variants={staggerItem} className="flex w-full flex-col gap-10">
        {sections.map((section) => (
          <MotionDiv key={section.title} variants={staggerItem}>
            <Head3Client title={section.title} />
            <div className="backgroundSecond rounded-3xl border border-gray-300 p-5 shadow-xl dark:border-gray-700">
              {section.component}
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>
    </MotionDiv>
  );
}
