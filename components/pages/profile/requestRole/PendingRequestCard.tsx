import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

function PendingRequestCard({
  message,
  isPending,
  onCancel,
  cancelLabel,
}: {
  message: string;
  isPending: boolean;
  onCancel: () => void;
  cancelLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
        <Clock size={20} className="shrink-0 text-amber-600" />
        <span className="font-medium text-amber-700 dark:text-amber-400">
          {message}
        </span>
      </div>

      <Button
        onClick={onCancel}
        disabled={isPending}
        variant="outline"
        className="w-fit"
      >
        {isPending ? <Loading size="sm" /> : cancelLabel}
      </Button>
    </div>
  );
}

export default PendingRequestCard;
