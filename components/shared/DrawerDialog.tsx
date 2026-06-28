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
import clsx from 'clsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type DrawerDialogProps = {
  children?: React.ReactNode;
  trigger: React.ReactNode;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  className?: string;
  tooltipContent?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DrawerDialog({
  children,
  trigger,
  title,
  desc,
  className,
  tooltipContent,
  open,
  onOpenChange,
}: DrawerDialogProps) {
  // const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const params = useParams();
  const locale = params.locale;

  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;

  const dialogOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }

    onOpenChange?.(value);
  };
  if (isDesktop) {
    return (
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {tooltipContent ? (
            <Tooltip>
              <TooltipTrigger asChild onClick={() => handleOpenChange(true)}>
                {trigger}
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            trigger
          )}
        </DialogTrigger>

        <DialogContent
          className={'no-scrollbar max-h-4/5 w-full overflow-scroll'}
          dir={locale === 'en' ? 'ltr' : 'rtl'}
        >
          <DialogHeader dir={locale === 'en' ? 'ltr' : 'rtl'}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          <div className={className}>{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={dialogOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        className="no-scrollbar"
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        <div className={clsx(className)}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
