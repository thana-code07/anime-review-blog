import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { validateLoginForm } from "@/lib/validation";

const inputClassName =
  "h-12 border-border bg-white px-4 py-3 text-base md:text-base";

function FormField({ id, label, error, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-brown-900">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authFailed, setAuthFailed] = useState(false);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setAuthFailed(false);
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = login(form);
    if (!result.success) {
      setAuthFailed(true);
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: "Please try another password or email",
        classNames: {
          toast: "bg-[#f87171] text-white border-none",
          title: "text-white font-bold text-lg",
          description: "!text-white text-[15px] leading-normal",
          closeButton:
            "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
        },
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
            <FormField id="email" label="Email" error={errors.email}>
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

            <FormField id="password" label="Password" error={errors.password}>
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

            <Button type="submit" variant="primary" className="mt-2 w-full">
              Log in
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
