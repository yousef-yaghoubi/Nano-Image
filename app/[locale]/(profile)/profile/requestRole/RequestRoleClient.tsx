'use client';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { useRequestRole } from '@/hooks/mutations/useRequestRole';
import {
  Shield,
  ShieldCheck,
  Clock,
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  MotionH1,
  MotionP,
  MotionDiv,
} from '@/components/shared/MotionWarpper';
import { toast } from 'sonner';

interface RequestRoleClientProps {
  role: string;
  waitForAdmin: boolean;
}

const permissionIcons = [
  <LayoutDashboard key="panel" size={20} />,
  <FileCheck key="prompts" size={20} />,
  <Users key="users" size={20} />,
  <BarChart3 key="stats" size={20} />,
];

const permissionKeys = ['panel', 'prompts', 'users', 'stats'] as const;

function RequestRoleClient({ role, waitForAdmin }: RequestRoleClientProps) {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'fa';
  const tMessage = useTranslations('Messages');
  const t = useTranslations('Pages.RequestRole');
  const tTable = useTranslations('Table');
  const { mutateAsync, isPending } = useRequestRole();

  const handleClick = async () => {
    try {
      const res = await mutateAsync();
      if (res.status) {
        toast.success(tMessage(res.message));
      } else {
        toast.error(tMessage(res.message));
      }
    } catch {
      toast.error(tMessage('generic'));
    }
  };

  const slideDir = locale === 'en' ? -100 : 100;

  return (
    <div className="flex w-full flex-col gap-10">
      <MotionH1
        initial={{ x: slideDir, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="heading-1 text-primary mb-3"
      >
        {t('head')}
      </MotionH1>
      <div className="backgroundSecond rounded-3xl border border-gray-300 p-6 shadow-xl md:p-8 dark:border-gray-700">
        <MotionP
          initial={{ x: slideDir, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-muted-foreground mb-6"
        >
          {t('description')}
        </MotionP>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="text-sm font-medium">{t('currentRole')}:</span>
          <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold">
            {tTable(`role.${role}`)}
          </span>
        </MotionDiv>

        {role !== 'MEMBER' ? (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20"
          >
            <ShieldCheck size={24} className="shrink-0 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-400">
              {t('adminApproval')}
            </span>
          </MotionDiv>
        ) : (
          <>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mb-6"
            >
              <p className="text-muted-foreground mb-4 text-sm font-medium">
                {t('premissonList')}
              </p>
              <div className="flex flex-col gap-3">
                {permissionKeys.map((key, i) => (
                  <MotionDiv
                    key={key}
                    initial={{ opacity: 0, x: slideDir }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="bg-muted/50 flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <span className="text-primary shrink-0">
                      {permissionIcons[i]}
                    </span>
                    <span className="text-sm">{t(`premissions.${key}`)}</span>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>

            {waitForAdmin ? (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                  <Clock size={20} className="shrink-0 text-amber-600" />
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {t('pending')}
                  </span>
                </div>
                <Button
                  onClick={handleClick}
                  disabled={isPending}
                  variant="outline"
                  className="w-fit"
                >
                  {isPending ? <Loading size="sm" /> : t('cancelButton')}
                </Button>
              </MotionDiv>
            ) : (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button onClick={handleClick} disabled={isPending}>
                  {isPending ? (
                    <Loading size="sm" className="flex gap-2" />
                  ) : (
                    <span className="flex justify-around gap-2">
                      <Shield size={16} />
                      {t('requestButton')}
                    </span>
                  )}
                </Button>
              </MotionDiv>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RequestRoleClient;
