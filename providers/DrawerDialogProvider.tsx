'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { DrawerDialog } from '@/components/shared/DrawerDialog';

type DialogConfig = {
  title?: ReactNode;
  desc?: ReactNode;
  content?: ReactNode;
  className?: string;
};

type DrawerDialogContextType = {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
};

const DrawerDialogContext = createContext<DrawerDialogContextType | null>(null);

export function DrawerDialogProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [open, setOpen] = useState(false);

  const openDialog = useCallback((cfg: DialogConfig) => {
    setConfig(cfg);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <DrawerDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <DrawerDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setConfig(null);
        }}
        title={config?.title}
        desc={config?.desc}
        className={config?.className}
      >
        {config?.content}
      </DrawerDialog>
    </DrawerDialogContext.Provider>
  );
}

export function useDrawerDialog() {
  const ctx = useContext(DrawerDialogContext);
  if (!ctx) {
    throw new Error('useDrawerDialog must be used within DrawerDialogProvider');
  }
  return ctx;
}
