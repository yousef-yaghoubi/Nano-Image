import AppSidebar from '@/components/pages/admin/Sidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="px-10 py-10 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default layout;
