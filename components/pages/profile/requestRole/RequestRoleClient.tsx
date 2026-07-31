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
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  MotionDiv,
  staggerContainer,
  staggerItem,
} from '@/components/shared/MotionWarpper';

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
  const t = useTranslations('Pages.RequestRole');
  const tTable = useTranslations('Table');
  const { mutateAsync, isPending } = useRequestRole();

  const handleClick = async () => {
    await mutateAsync();
  };

  return (
    <MotionDiv
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="flex w-full flex-col gap-10"
    >
      <MotionDiv variants={staggerItem}>
        <h1 className="heading-1 text-primary mb-3">{t('head')}</h1>
      </MotionDiv>
      <MotionDiv
        variants={staggerItem}
        className="backgroundSecond rounded-3xl border border-gray-300 p-6 shadow-xl md:p-8 dark:border-gray-700"
      >
        <MotionDiv variants={staggerItem}>
          <p className="text-muted-foreground mb-6">{t('description')}</p>
        </MotionDiv>

        <MotionDiv
          variants={staggerItem}
          className="mb-6 flex items-center gap-3"
        >
          <span className="text-sm font-medium">{t('currentRole')}:</span>
          <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold">
            {tTable(`role.${role}`)}
          </span>
        </MotionDiv>

        {role !== 'MEMBER' ? (
          <MotionDiv
            variants={staggerContainer}
            className="flex flex-col gap-4"
          >
            <MotionDiv
              variants={staggerItem}
              className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20"
            >
              <ShieldCheck size={24} className="shrink-0 text-green-600" />
              <span className="font-medium text-green-700 dark:text-green-400">
                {t('adminApproval')}
              </span>
            </MotionDiv>
            <MotionDiv variants={staggerItem}>
              <Link href={`/${locale}/admin`}>
                <Button variant="default" className="w-fit">
                  <LayoutDashboard size={16} />
                  {t('goToAdmin')}
                </Button>
              </Link>
            </MotionDiv>
          </MotionDiv>
        ) : (
          <>
            <MotionDiv variants={staggerItem} className="mb-6">
              <p className="text-muted-foreground mb-4 text-sm font-medium">
                {t('premissonList')}
              </p>
              <MotionDiv
                variants={staggerContainer}
                className="flex flex-col gap-3"
              >
                {permissionKeys.map((key) => (
                  <MotionDiv
                    key={key}
                    variants={staggerItem}
                    className="bg-muted/50 flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <span className="text-primary shrink-0">
                      {permissionIcons[permissionKeys.indexOf(key)]}
                    </span>
                    <span className="text-sm">{t(`premissions.${key}`)}</span>
                  </MotionDiv>
                ))}
              </MotionDiv>
            </MotionDiv>

            {waitForAdmin ? (
              <MotionDiv
                variants={staggerContainer}
                className="flex flex-col gap-4"
              >
                <MotionDiv
                  variants={staggerItem}
                  className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20"
                >
                  <Clock size={20} className="shrink-0 text-amber-600" />
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {t('pending')}
                  </span>
                </MotionDiv>
                <MotionDiv variants={staggerItem}>
                  <Button
                    onClick={handleClick}
                    disabled={isPending}
                    variant="outline"
                    className="w-fit"
                  >
                    {isPending ? <Loading size="sm" /> : t('cancelButton')}
                  </Button>
                </MotionDiv>
              </MotionDiv>
            ) : (
              <MotionDiv variants={staggerItem}>
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
      </MotionDiv>
    </MotionDiv>
  );
}

export default RequestRoleClient;
