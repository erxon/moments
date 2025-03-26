"use client";

import { toast } from "sonner";

export default function triggerSuccessToast(message: string) {
  return toast.success(message, {
    action: {
      label: "Close",
      onClick: () => {
        toast.dismiss();
      },
    },
  });
}
