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
import { Filter } from 'lucide-react';

export function DrawerDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const BtnFilter = () => {
    return (
      <button
        className="mb-5 text-lg flex gap-2 items-center font-medium"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
      >
        <Filter size={20} />
        Filters
      </button>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="w-full border-b border-primary">
          <DialogTrigger asChild>
            <BtnFilter />
          </DialogTrigger>
        </div>
        <DialogContent className="w-full max-h-4/5 overflow-scroll">
          <DialogHeader className="text-left">
            <DialogTitle>Filter Prompts</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {children}
          {/* <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="w-full border-b border-primary">
        <DrawerTrigger asChild>
          <BtnFilter />
        </DrawerTrigger>
      </div>
      <DrawerContent>
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

// function ProfileForm({ className }: React.ComponentProps<"form">) {
//   return (
//     <form className={cn("grid items-start gap-6", className)}>
//       <div className="grid gap-3">
//         <Label htmlFor="email">Email</Label>
//         <Input type="email" id="email" defaultValue="shadcn@example.com" />
//       </div>
//       <div className="grid gap-3">
//         <Label htmlFor="username">Username</Label>
//         <Input id="username" defaultValue="@shadcn" />
//       </div>
//       <Button type="submit">Save changes</Button>
//     </form>
//   )
// }
