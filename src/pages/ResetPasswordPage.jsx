import { useState } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/forms/FormField";
import { ResetPasswordDialog } from "@/components/auth/ResetPasswordDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  errorToastClassNames,
  inputClassName,
  successToastClassNames,
} from "@/lib/constants";
import { validateResetPasswordForm } from "@/lib/validation";

const emptyForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// change password form for logged-in users
export function ResetPasswordPage() {
  const { changePassword, logout } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateResetPasswordForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirmReset() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      if (!result.success) {
        setConfirmOpen(false);
        if (result.field) {
          setErrors({ [result.field]: result.message });
        } else if (result.status === 401) {
          logout();
          toast.error("Session expired", {
            description: "Please log in again to reset your password.",
            classNames: errorToastClassNames,
          });
        } else {
          toast.error("Failed to reset password", {
            description: result.message || "Please try again.",
            classNames: errorToastClassNames,
          });
        }
        return;
      }

      setConfirmOpen(false);
      setForm(emptyForm);
      setErrors({});

      toast.success("Password reset", {
        description: "Your password has been successfully updated.",
        classNames: successToastClassNames,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl bg-brown-200/40 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormField
            id="currentPassword"
            label="Current password"
            error={errors.currentPassword}
          >
            <Input
              id="currentPassword"
              type="password"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              aria-invalid={!!errors.currentPassword}
              className={inputClassName}
            />
          </FormField>

          <FormField
            id="newPassword"
            label="New password"
            error={errors.newPassword}
          >
            <Input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              aria-invalid={!!errors.newPassword}
              className={inputClassName}
            />
          </FormField>

          <FormField
            id="confirmPassword"
            label="Confirm new password"
            error={errors.confirmPassword}
          >
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              className={inputClassName}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            className="rounded-full px-8"
            disabled={isSubmitting}
          >
            Reset password
          </Button>
        </form>
      </div>

      <ResetPasswordDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) setConfirmOpen(open);
        }}
        onConfirm={handleConfirmReset}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
