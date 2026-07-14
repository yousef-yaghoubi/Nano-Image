import { MotionDiv } from '@/components/shared/MotionWarpper';

function RoleBadge({
  currentRole,
  roleLabel,
  delay = 0.3,
}: {
  currentRole: string;
  roleLabel: string;
  delay?: number;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-6 flex items-center gap-3"
    >
      <span className="text-sm font-medium">{currentRole}:</span>
      <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold">
        {roleLabel}
      </span>
    </MotionDiv>
  );
}

export default RoleBadge;
