import { ShieldCheck } from 'lucide-react';
import { MotionDiv } from '@/components/shared/MotionWarpper';

function AdminStatusCard({
  message,
  delay = 0.4,
}: {
  message: string;
  delay?: number;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20"
    >
      <ShieldCheck size={24} className="shrink-0 text-green-600" />
      <span className="font-medium text-green-700 dark:text-green-400">
        {message}
      </span>
    </MotionDiv>
  );
}

export default AdminStatusCard;
