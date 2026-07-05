import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/Button";

export function LoginRequiredDialog({ open, onOpenChange }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-0 p-8 sm:max-w-md">
        <AlertDialogCancel
          className="absolute top-4 right-4 size-8 rounded-full border-0 bg-transparent p-0 text-brown-600 hover:bg-brown-100 hover:text-brown-900"
          aria-label="Close"
        >
          <X className="size-4" />
        </AlertDialogCancel>

        <AlertDialogHeader className="space-y-6 text-center">
          <AlertDialogTitle className="text-lg font-bold text-brown-900">
            Create an account to continue
          </AlertDialogTitle>

          <Button
            variant="primary"
            className="w-full rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Create account
          </Button>

          <p className="text-sm text-brown-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-brown-900 underline underline-offset-2 hover:text-brown-800"
              onClick={() => onOpenChange(false)}
            >
              Log in
            </button>
          </p>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
