"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 shadow-lg relative w-full max-w-md z-50">
        {children}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div
        className="absolute inset-0 backdrop-blur-md"
        onClick={onClose}
      ></div>
    </div>,
    document.body
  );
}
