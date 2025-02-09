"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      className="btn btn-secondary uppercase tracking-widest"
      type="submit"
      aria-disabled={pending}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
