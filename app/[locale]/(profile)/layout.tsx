import Sidebar from '@/components/shared/Profile/Sidebar';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full justify-between gap-10">
      <Sidebar />
      <div className="flex flex-col w-full">{children}</div>
    </div>
  );
}

export default layout;
