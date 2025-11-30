import { getTranslations } from 'next-intl/server';
import AuthButtons from './AuthButtons';

async function NotAuthenticated({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const t = await getTranslations('Errors');

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100dvh-240px)] gap-4">
      <h2 className="heading-2">{t('isNotAuthenticated')}</h2>
      <div className="flex gap-2">
        <AuthButtons isAuthenticated={isAuthenticated}></AuthButtons>
      </div>
    </div>
  );
}

export default NotAuthenticated;
