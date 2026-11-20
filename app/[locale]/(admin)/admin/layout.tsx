'use client';
import React from 'react';
import AppSidebar from '@/components/pages/admin/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { MotionMain } from '@/components/shared/MotionWarpper';

function layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  const locale = useLocale();
  return (
    <div className="flex h-screen transition-[grid-template-columns] duration-300">
      <AppSidebar />
      <MotionMain
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={cn(
          'relative my-10 h-fit w-full px-10 py-10 transition-all duration-300',
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
      </MotionMain>
    </div>
  );
}

export default layout;
