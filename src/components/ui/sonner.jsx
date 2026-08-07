import { Toaster as Sonner } from "sonner";
import {
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      closeButton
      expand
      visibleToasts={3}
      gap={12}
      className="toaster group"
      icons={{
        success: null,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: null,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "sonner-toast",
          success: "sonner-toast-success",
          error: "sonner-toast-error",
          title: "sonner-toast-title",
          description: "sonner-toast-description",
          closeButton: "sonner-toast-close",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
