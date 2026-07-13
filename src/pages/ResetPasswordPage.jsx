import { useState } from "react";
import { toast } from "sonner";

import { ResetPasswordDialog } from "@/components/ResetPasswordDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { validateResetPasswordForm } from "@/lib/validation";

const inputClassName =
  "h-12 border-border bg-white px-4 py-3 text-base md:text-base";

const successToastClassNames = {
  toast: "bg-[#31dc70] text-white border-none",
  title: "text-white font-bold text-lg",
  description: "!text-white text-[15px] leading-normal",
  closeButton:
    "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
};

const emptyForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function FormField({ id, label, error, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-brown-600">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ResetPasswordPage() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  function handleConfirmReset() {
    const result = changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (!result.success) {
      setConfirmOpen(false);
      if (result.field) {
        setErrors({ [result.field]: result.message });
      } else {
        toast.error("Failed to reset password", {
          description: result.message || "Please try again.",
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
          >
            Reset password
          </Button>
        </form>
      </div>

      <ResetPasswordDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}
