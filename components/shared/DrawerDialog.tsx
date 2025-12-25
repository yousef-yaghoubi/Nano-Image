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

export function DrawerDialog({
  children,
  trigger,
  title,
  desc,
}: {
  children?: React.ReactNode;
  trigger: React.ReactNode;
  title?: React.ReactNode;
  desc?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const params = useParams();
  const locale = params.locale;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent
          className="w-full max-h-4/5 overflow-scroll"
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        >
          <DialogHeader dir={locale === 'en' ? 'ltr' : 'rtl'}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent dir={locale === 'en' ? 'ltr' : 'rtl'}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
