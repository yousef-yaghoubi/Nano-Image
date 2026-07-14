import { Shield } from 'lucide-react';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

function RequestButton({
  label,
  isPending,
  onClick,
  delay = 0.8,
}: {
  label: string;
  isPending: boolean;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Button onClick={onClick} disabled={isPending}>
        {isPending ? (
          <Loading size="sm" />
        ) : (
          <span className="flex items-center gap-2">
            <Shield size={16} />
            {label}
          </span>
        )}
      </Button>
    </MotionDiv>
  );
}

export default RequestButton;
