"use client";

import { toast } from "sonner";

export default function triggerErrorToast(message: string) {
  return toast.error(message, {
    action: {
      label: "Close",
      onClick: () => {
        toast.dismiss();
      },
    },
  });
}
