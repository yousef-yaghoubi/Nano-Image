import { SidebarProvider } from '@/context/SidebarContext';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}

export default layout;
