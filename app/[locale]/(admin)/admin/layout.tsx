'use client';
import React from 'react';
import AppSidebar from '@/components/pages/admin/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

function layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  const locale = useLocale();
  return (
    <div className="flex h-screen transition-[grid-template-columns] duration-300">
      <AppSidebar />
      <main
        className={cn(
          'w-full px-10 py-10 transition-all duration-300',
          locale == 'en'
            ? isExpanded
              ? 'pl-96'
              : 'pl-32'
            : isExpanded
              ? 'pr-96'
              : 'pr-32'
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default layout;
