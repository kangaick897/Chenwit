"use client";

import type { ReactNode } from "react";

type ConfirmDeleteButtonProps = {
  children: ReactNode;
  label: string;
  message: string;
};

export function ConfirmDeleteButton({ children, label, message }: ConfirmDeleteButtonProps) {
  return (
    <button
      type="submit"
      aria-label={label}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
