import { getTranslations } from 'next-intl/server';
import AuthButtons from './AuthButtons';

async function NotAuthenticated() {
  const t = await getTranslations('Messages');

  return (
    <div className="flex h-[calc(100dvh-240px)] flex-col items-center justify-center gap-4">
      <h2 className="heading-2">{t('isNotAuthenticated')}</h2>
      <div className="flex gap-2">
        <AuthButtons/>
      </div>
    </div>
  );
}

export default NotAuthenticated;
