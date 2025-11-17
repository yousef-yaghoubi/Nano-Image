'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  const [mounted] = useState(() => typeof window !== 'undefined');

  // const onClose = () => setMounted(false);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl overflow-scroll p-6 shadow-lg relative w-full max-w-lg max-h-4/5 z-50">
        {children}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="absolute inset-0 backdrop-blur-md" onClick={onClose}></div>
    </div>,
    document.body,
  );
}
