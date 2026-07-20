import {
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

const permissions: { key: string; icon: LucideIcon }[] = [
  { key: 'panel', icon: LayoutDashboard },
  { key: 'prompts', icon: FileCheck },
  { key: 'users', icon: Users },
  { key: 'stats', icon: BarChart3 },
];

function PermissionList({
  premissonList,
  premissions,
}: {
  premissonList: string;
  premissions: Record<string, string>;
}) {
  return (
    <div className="mb-6">
      <p className="text-muted-foreground mb-4 text-sm font-medium">
        {premissonList}
      </p>
      <div className="flex flex-col gap-3">
        {permissions.map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-muted/50 p-3 dark:border-gray-700"
          >
            <span className="shrink-0 text-primary">
              <Icon size={20} />
            </span>
            <span className="text-sm">{premissions[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PermissionList;
