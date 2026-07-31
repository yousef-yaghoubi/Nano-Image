import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

function RequestButton({
  label,
  isPending,
  onClick,
}: {
  label: string;
  isPending: boolean;
  onClick: () => void;
}) {
  return (
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
  );
}

export default RequestButton;
