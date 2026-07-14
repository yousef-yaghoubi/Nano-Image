'use client';

import { MotionDiv, MotionH3 } from '@/components/shared/MotionWarpper';
import HeadPage from '@/components/shared/Prompts/HeadPage';
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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
  loading,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: React.ReactNode;
  color: string;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <MotionDiv
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="backgroundSecond text-card-foreground flex items-center gap-4 rounded-xl border p-6 shadow-sm"
    >
      <div className={cn('rounded-lg p-3', color)}>
        <Icon size={28} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-sm">{label}</p>
        {loading ? (
          <Skeleton className="mt-1 h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        {subtitle && (
          <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
        )}
      </div>
    </MotionDiv>
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
    <div className="space-y-8">
      <HeadPage head={tAdmin('overview.overview')} />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Files}
          label={tAdmin('overview.totalPrompts')}
          value={stats?.totalPrompts ?? 0}
          color="bg-blue-500"
          loading={isLoading}
        />
        <StatCard
          icon={Heart}
          label={tAdmin('overview.totalLikes')}
          value={stats?.totalLikes ?? 0}
          color="bg-rose-500"
          loading={isLoading}
        />
        <StatCard
          icon={Users}
          label={tAdmin('overview.totalUsers')}
          value={stats?.totalUsers ?? 0}
          color="bg-emerald-500"
          subtitle={`${stats?.membersCount ?? 0} ${tAdmin('overview.membersCount')} · ${stats?.adminsCount ?? 0} ${tAdmin('overview.adminsCount')}`}
          loading={isLoading}
        />
        <StatCard
          icon={FileCheck}
          label={tAdmin('overview.activePrompts')}
          value={stats?.activePrompts ?? 0}
          color="bg-green-500"
          loading={isLoading}
        />
        <StatCard
          icon={Clock}
          label={tAdmin('overview.pendingPrompts')}
          value={stats?.pendingPrompts ?? 0}
          color="bg-amber-500"
          subtitle={`${stats?.rejectedPrompts ?? 0} ${tAdmin('overview.rejectedPrompts')}`}
          loading={isLoading}
        />
        <StatCard
          icon={ShieldAlert}
          label={tAdmin('overview.adminRequests')}
          value={stats?.adminRequests ?? 0}
          color="bg-violet-500"
          loading={isLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Prompts */}
        <MotionDiv
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backgroundSecond text-card-foreground rounded-xl border p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {tAdmin('overview.recentPrompts')}
            </h2>
            <Link
              href={`/${locale}/admin/prompts`}
              className="text-primary text-sm hover:underline"
            >
              {tAdmin('prompts.prompts')}
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : stats?.recentPrompts?.length ? (
              stats.recentPrompts.map((prompt) => (
                <div
                  key={prompt._id}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {prompt.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
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
                      className="text-[10px] capitalize"
                    >
                      {tAdmin(`prompts.status.${prompt.status}`)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {tAdmin('overview.noData')}
              </p>
            )}
          </div>
        </MotionDiv>

        {/* Recent Users */}
        <MotionDiv
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="backgroundSecond text-card-foreground rounded-xl border p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {tAdmin('overview.recentUsers')}
            </h2>
            <Link
              href={`/${locale}/admin/users`}
              className="text-primary text-sm hover:underline"
            >
              {tAdmin('users.users')}
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : stats?.recentUsers?.length ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
                        ? 'default'
                        : 'secondary'
                    }
                    className="shrink-0 text-[10px] capitalize"
                  >
                    {tAdmin(`users.role.${user.role}`)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                {tAdmin('overview.noData')}
              </p>
            )}
          </div>
        </MotionDiv>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <MotionH3
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="heading-3 text-primary"
        >
          {tAdmin('overview.quickActions')}
        </MotionH3>
        <MotionDiv
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <Button
            variant="default"
            size="lg"
            onClick={handleUpdatePrompts}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {isPending ? tMessages('loading') : tAdmin('admin.updatePrompts')}
          </Button>

          <Link href={`/${locale}/admin/prompts`}>
            <Button variant="outline" size="lg" className="gap-2">
              <Files size={18} />
              {tAdmin('prompts.prompts')}
            </Button>
          </Link>

          <Link href={`/${locale}/admin/users`}>
            <Button variant="outline" size="lg" className="gap-2">
              <UserCog size={18} />
              {tAdmin('users.users')}
            </Button>
          </Link>
        </MotionDiv>
      </div>
    </div>
  );
}

export default Page;
