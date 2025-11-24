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
}: {
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const params = useParams();
  const locale = params.locale;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <div className="w-full border-b border-primary"> */}
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {/* </div> */}
        <DialogContent
          className="w-full max-h-4/5 overflow-scroll"
          dir={locale == 'fa' ? 'rtl' : 'ltr'}
        >
          <DialogHeader className="text-left">
            <DialogTitle>Filter Prompts</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* <div className="w-full border-b border-primary"> */}
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      {/* </div> */}
      <DrawerContent dir={locale == 'fa' ? 'rtl' : 'ltr'}>
        <DrawerHeader className="text-left">
          <DrawerTitle>Filter Prompts</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
