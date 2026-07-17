import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/Button";

// confirm dialog before deleting an admin category
export function DeleteCategoryDialog({ open, onOpenChange, onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-0 p-8 sm:max-w-md">
        <AlertDialogCancel
          className="absolute top-4 right-4 size-8 rounded-full border-0 bg-transparent p-0 text-brown-600 hover:bg-brown-100 hover:text-brown-900"
          aria-label="Close"
        >
          <X className="size-4" />
        </AlertDialogCancel>

        <AlertDialogHeader className="space-y-3 text-center sm:place-items-center sm:text-center">
          <AlertDialogTitle className="text-xl font-bold text-brown-900">
            Delete category
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-brown-600">
            Do you want to delete this category?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex-row justify-center gap-3 sm:justify-center">
          <AlertDialogCancel className="rounded-full border-brown-900 px-8 text-brown-900">
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            variant="primary"
            className="rounded-full px-8"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
