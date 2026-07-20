'use client';

import HeadPage from '@/components/shared/Prompts/HeadPage';
import { MotionDiv, staggerContainer, staggerItem } from '@/components/shared/MotionWarpper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAddPromptsList } from '@/hooks/mutations/useAddPrompt';
import useAdminOverview from '@/hooks/queries/useAdminOverview';
import { cn } from '@/lib/utils';
import {
  Clock,
  FileCheck,
  Files,
  Heart,
  Loader,
  ShieldAlert,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

const STAT_CARDS: {
  key: string;
  icon: LucideIcon;
  color: string;
  valueKey: 'totalPrompts' | 'totalLikes' | 'totalUsers' | 'activePrompts' | 'pendingPrompts' | 'adminRequests';
}[] = [
  { key: 'totalPrompts', icon: Files, color: 'bg-blue-500', valueKey: 'totalPrompts' },
  { key: 'totalLikes', icon: Heart, color: 'bg-rose-500', valueKey: 'totalLikes' },
  { key: 'totalUsers', icon: Users, color: 'bg-emerald-500', valueKey: 'totalUsers' },
  { key: 'activePrompts', icon: FileCheck, color: 'bg-green-500', valueKey: 'activePrompts' },
  { key: 'pendingPrompts', icon: Clock, color: 'bg-amber-500', valueKey: 'pendingPrompts' },
  { key: 'adminRequests', icon: ShieldAlert, color: 'bg-violet-500', valueKey: 'adminRequests' },
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <div className="backgroundSecond text-card-foreground flex items-center gap-3 rounded-xl border p-4 shadow-sm sm:gap-4 sm:p-6">
      <div className={cn('rounded-lg p-2 sm:p-3', color)}>
        <Icon size={22} className="text-white sm:size-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs sm:text-sm">{label}</p>
        {loading ? (
          <Skeleton className="mt-1 h-6 w-14 sm:h-8 sm:w-16" />
        ) : (
          <p className="text-xl font-bold sm:text-2xl">{value}</p>
        )}
        {subtitle && (
          <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Page() {
  const tAdmin = useTranslations('Pages.Admin');
  const tMessages = useTranslations('Messages');
  const locale = useLocale();

  const { mutateAsync, isPending } = useAddPromptsList();
  const { data: overview, isLoading } = useAdminOverview();
  const stats = overview?.data;

  const handleUpdatePrompts = async () => {
    try {
      const response = await mutateAsync();

      if (response.success) {
        tMessages(response.message, {
          length: response.inserted as number,
        });
      } else {
        tMessages(response.message);
      }
    } catch {
      // handled by mutation
    }
  };

  return (
    <MotionDiv
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
    <MotionDiv variants={staggerItem} className="space-y-8">
      <MotionDiv variants={staggerItem}>
        <HeadPage head={tAdmin('overview.overview')} />
      </MotionDiv>

      {/* Stats Grid */}
      <MotionDiv
        variants={staggerContainer}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {STAT_CARDS.map((card) => (
          <MotionDiv key={card.key} variants={staggerItem}>
            <StatCard
              icon={card.icon}
              label={tAdmin(`overview.${card.key}`)}
              value={stats?.[card.valueKey] ?? 0}
              color={card.color}
              subtitle={
                card.key === 'totalUsers'
                  ? `${stats?.membersCount ?? 0} ${tAdmin('overview.membersCount')} · ${stats?.adminsCount ?? 0} ${tAdmin('overview.adminsCount')}`
                  : card.key === 'pendingPrompts'
                    ? `${stats?.rejectedPrompts ?? 0} ${tAdmin('overview.rejectedPrompts')}`
                    : undefined
              }
              loading={isLoading}
            />
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Recent Activity */}
      <MotionDiv
        variants={staggerContainer}
        className="grid gap-4 lg:grid-cols-2 lg:gap-6"
      >
        {/* Recent Prompts */}
        <MotionDiv variants={staggerItem} className="backgroundSecond text-card-foreground rounded-xl border p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-sm font-semibold sm:text-lg">
              {tAdmin('overview.recentPrompts')}
            </h2>
            <Link
              href={`/${locale}/admin/prompts`}
              className="text-primary text-xs hover:underline sm:text-sm"
            >
              {tAdmin('prompts.prompts')}
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {isLoading ? (
              <Skeleton className="h-8 w-full sm:h-10" />
            ) : stats?.recentPrompts?.length ? (
              stats.recentPrompts.map((prompt) => (
                <div
                  key={prompt._id}
                  className="flex flex-col gap-1 border-b pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:border-0 sm:pb-0"
                >
                  <p className="line-clamp-3 truncate text-xs sm:text-sm">
                    {prompt.title.slice(0, 30)}
                    {prompt.title.length > 30 ? '...' : ''}
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                      ♥ {prompt.likes}
                    </span>
                    <Badge
                      variant={
                        prompt.status === 'True'
                          ? 'default'
                          : prompt.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className="text-[9px] capitalize sm:text-[10px]"
                    >
                      {tAdmin(`prompts.status.${prompt.status}`)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs sm:text-sm">
                {tAdmin('overview.noData')}
              </p>
            )}
          </div>
        </MotionDiv>

        {/* Recent Users */}
        <MotionDiv variants={staggerItem} className="backgroundSecond text-card-foreground rounded-xl border p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-sm font-semibold sm:text-lg">
              {tAdmin('overview.recentUsers')}
            </h2>
            <Link
              href={`/${locale}/admin/users`}
              className="text-primary text-xs hover:underline sm:text-sm"
            >
              {tAdmin('users.users')}
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {isLoading ? (
              <Skeleton className="h-8 w-full sm:h-10" />
            ) : stats?.recentUsers?.length ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col gap-1 border-b pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:border-0 sm:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium sm:text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground truncate text-[10px] sm:text-xs">
                      {user.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
                        ? 'default'
                        : 'secondary'
                    }
                    className="shrink-0 self-start text-[9px] capitalize sm:self-auto sm:text-[10px]"
                  >
                    {tAdmin(`users.role.${user.role}`)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs sm:text-sm">
                {tAdmin('overview.noData')}
              </p>
            )}
          </div>
        </MotionDiv>
      </MotionDiv>

      {/* Quick Actions */}
      <MotionDiv variants={staggerItem} className="space-y-4">
        <h3 className="heading-3 text-primary">
          {tAdmin('overview.quickActions')}
        </h3>
        <MotionDiv
          variants={staggerContainer}
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          <MotionDiv variants={staggerItem}>
            <Button
              variant="default"
              size="lg"
              onClick={handleUpdatePrompts}
              disabled={isPending}
              className="w-full gap-2 sm:w-auto"
            >
              {isPending ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {isPending ? tMessages('loading') : tAdmin('admin.updatePrompts')}
            </Button>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Link href={`/${locale}/admin/prompts`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <Files size={18} />
                {tAdmin('prompts.prompts')}
              </Button>
            </Link>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Link href={`/${locale}/admin/users`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <UserCog size={18} />
                {tAdmin('users.users')}
              </Button>
            </Link>
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </MotionDiv>
    </MotionDiv>
  );
}

export default Page;
