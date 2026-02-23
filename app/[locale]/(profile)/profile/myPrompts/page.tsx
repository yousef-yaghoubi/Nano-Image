import { Suspense } from 'react';
import PromptTableWrapper from './PromptTableWrapper';
import { TableSkeleton } from './TableSkeleton';


async function page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  return (
    <div className="min-w-0 w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="min-w-0 w-full overflow-hidden">
        <Suspense fallback={<TableSkeleton head/>}>
        <PromptTableWrapper searchParams={searchParams}/>
        </Suspense>
        <TableSkeleton head/>
      </div>
    </div>
  );
}

export default page;
