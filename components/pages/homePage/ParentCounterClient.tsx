'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useQuantities from '@/hooks/queries/useQuantities';
import { Counter } from './Counter';

type ParentCounterClientProps = {
  promptsLabel: string;
  tagsLabel: string;
  likesLabel: string;
};

function ParentCounterClient({
  promptsLabel,
  tagsLabel,
  likesLabel,
}: ParentCounterClientProps) {
  const { data, isLoading, isError } = useQuantities();

  if (isLoading) {
    return <Skeleton className="h-32 rounded-3xl" />;
  }

  if (isError || !data?.success) {
    return null;
  }

  return (
    <div className="backgroundSecond flex items-center justify-around rounded-3xl border border-gray-300 p-2 md:p-5 dark:border-gray-700">
      <Counter count={data.data.prompts} title={promptsLabel} />
      <Counter count={30} title={tagsLabel} />
      <Counter count={data.data.likes} title={likesLabel} />
    </div>
  );
}

export default ParentCounterClient;
