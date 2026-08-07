import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { FormField } from "@/components/forms/FormField";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  errorToastClassNames,
  inputClassName,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { validateLoginForm } from "@/lib/validation";

// login form for email and password
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authFailed, setAuthFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setAuthFailed(false);
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await login(form);
    setIsSubmitting(false);

    if (!result.success) {
      setAuthFailed(true);
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: "Please try another password or email",
        classNames: errorToastClassNames,
      });
      return;
    }

    navigate("/");
  }

  const inputErrorClassName = authFailed ? "text-destructive" : undefined;

  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] rounded-2xl bg-brown-200/40 p-8 sm:p-10">
          <h1 className="mb-8 text-center text-2xl font-bold text-brown-900">
            Log in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="email"
              label="Email"
              error={errors.email}
              labelClassName="text-brown-900"
            >
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                aria-invalid={!!errors.email || authFailed}
                className={cn(inputClassName, inputErrorClassName)}
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              error={errors.password}
              labelClassName="text-brown-900"
            >
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
                aria-invalid={!!errors.password || authFailed}
                className={cn(inputClassName, inputErrorClassName)}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brown-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-brown-900 underline underline-offset-2 hover:text-brown-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
