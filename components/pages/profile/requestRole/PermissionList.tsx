import {
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { MotionDiv } from '@/components/shared/MotionWarpper';

const permissions: { key: string; icon: LucideIcon }[] = [
  { key: 'panel', icon: LayoutDashboard },
  { key: 'prompts', icon: FileCheck },
  { key: 'users', icon: Users },
  { key: 'stats', icon: BarChart3 },
];

function PermissionList({
  premissonList,
  premissions,
  delay = 0.35,
}: {
  premissonList: string;
  premissions: Record<string, string>;
  delay?: number;
}) {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'fa';
  const slideDir = locale === 'en' ? -100 : 100;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-6"
    >
      <p className="text-muted-foreground mb-4 text-sm font-medium">
        {premissonList}
      </p>
      <div className="flex flex-col gap-3">
        {permissions.map(({ key, icon: Icon }, i) => (
          <MotionDiv
            key={key}
            initial={{ opacity: 0, x: slideDir }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-muted/50 p-3 dark:border-gray-700"
          >
            <span className="shrink-0 text-primary">
              <Icon size={20} />
            </span>
            <span className="text-sm">{premissions[key]}</span>
          </MotionDiv>
        ))}
      </div>
    </MotionDiv>
  );
}

export default PermissionList;
