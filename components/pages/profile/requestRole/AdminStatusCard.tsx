import { ShieldCheck } from 'lucide-react';

function AdminStatusCard({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
      <ShieldCheck size={24} className="shrink-0 text-green-600" />
      <span className="font-medium text-green-700 dark:text-green-400">
        {message}
      </span>
    </div>
  );
}

export default AdminStatusCard;
