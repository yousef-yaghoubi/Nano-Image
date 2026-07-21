import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { ReactNode } from 'react';

const Dialog = dynamic(() =>
  import('@/components/ui/dialog').then((m) => m.Dialog)
);

type ImageModalProps = {
  src: string;
  alt?: string;
  trigger: ReactNode;
};

export function ImageModal({ src, alt = 'Image', trigger }: ImageModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="bg-background h-96 w-96 border-none p-0 shadow-none lg:h-1/2 lg:w-md xl:h-4/6 xl:w-full"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Image</DialogTitle>
        </DialogHeader>

        <Image
          fill
          alt={alt}
          src={src}
          className="h-auto max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
