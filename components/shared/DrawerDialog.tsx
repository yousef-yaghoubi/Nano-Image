'use client';
import * as React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function DrawerDialog({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const params = useParams();
  const locale = params.locale;
  const t = useTranslations('Filter.filter');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {/* </div> */}
        <DialogContent
          className="w-full max-h-4/5 overflow-scroll"
          dir={locale == 'fa' ? 'rtl' : 'ltr'}
        >
          <DialogHeader dir={locale == 'fa' ? 'rtl' : 'ltr'}>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent dir={locale == 'fa' ? 'rtl' : 'ltr'}>
        <DrawerHeader>
          <DrawerTitle>{t('title')}</DrawerTitle>
          <DrawerDescription>{t('description')}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
