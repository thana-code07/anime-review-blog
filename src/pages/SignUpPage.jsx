import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FormField } from "@/components/forms/FormField";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { inputClassName } from "@/lib/constants";
import { validateSignUpForm } from "@/lib/validation";

// registration form for new users
export function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateSignUpForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.field) {
        setErrors({ [result.field]: result.message });
      } else {
        setErrors({ email: result.message });
      }
      return;
    }

    navigate("/signup/success");
  }

  return (
    <div className="min-h-svh bg-brown-100">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] rounded-2xl bg-brown-200/40 p-8 sm:p-10">
          <h1 className="mb-8 text-center text-2xl font-bold text-brown-900">
            Sign up
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="name"
              label="Name"
              error={errors.name}
              labelClassName="text-brown-900"
            >
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange("name")}
                aria-invalid={!!errors.name}
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="username"
              label="Username"
              error={errors.username}
              labelClassName="text-brown-900"
            >
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange("username")}
                aria-invalid={!!errors.username}
                className={inputClassName}
              />
            </FormField>

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
                aria-invalid={!!errors.email}
                className={inputClassName}
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
                aria-invalid={!!errors.password}
                className={inputClassName}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              className="mt-2 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brown-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brown-900 underline underline-offset-2 hover:text-brown-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
