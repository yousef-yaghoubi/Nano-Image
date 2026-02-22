import Sidebar from '@/components/pages/profile/Sidebar';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-6 lg:gap-10">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export default layout;
