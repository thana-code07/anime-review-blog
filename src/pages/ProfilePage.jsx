import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { validateProfileForm } from "@/lib/validation";

const DEFAULT_AVATAR = "/default-avatar.png";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const inputClassName =
  "h-12 border-border bg-white px-4 py-3 text-base md:text-base";

const successToastClassNames = {
  toast: "bg-[#31dc70] text-white border-none",
  title: "text-white font-bold text-lg",
  description: "!text-white text-[15px] leading-normal",
  closeButton:
    "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
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

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name ?? "",
    username: user.username ?? "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
  const [errors, setErrors] = useState({});

  function handleChange(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Please select an image file",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image must be 2MB or smaller",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setErrors((prev) => ({ ...prev, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateProfileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = updateProfile({
      name: form.name,
      username: form.username,
      avatar: avatarPreview,
    });

    if (!result.success) {
      if (result.field) {
        setErrors({ [result.field]: result.message });
      } else {
        toast.error("Failed to save profile", {
          description: result.message || "Please try again.",
        });
      }
      return;
    }

    toast.success("Saved profile", {
      description: "Your profile has been successfully updated.",
      classNames: successToastClassNames,
    });
  }

  return (
    <div className="rounded-2xl bg-brown-200/40 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
          <img
            src={avatarPreview || DEFAULT_AVATAR}
            alt=""
            className="size-28 shrink-0 rounded-full object-cover sm:size-32"
          />
          <div className="flex flex-col items-center space-y-2 sm:items-start">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-brown-900 bg-white px-6 text-brown-900 hover:bg-brown-100"
              onClick={handleUploadClick}
            >
              Upload profile picture
            </Button>
            {errors.avatar && (
              <p className="text-sm text-destructive">{errors.avatar}</p>
            )}
          </div>
        </div>

        <hr className="hidden border-brown-300 sm:block" />

        <FormField id="name" label="Name" error={errors.name}>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange("name")}
            aria-invalid={!!errors.name}
            className={inputClassName}
          />
        </FormField>

        <FormField id="username" label="Username" error={errors.username}>
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

        <div className="space-y-2">
          <Label className="text-brown-600">Email</Label>
          <p className="text-base text-brown-400">{user.email}</p>
        </div>

        <Button type="submit" variant="primary" className="rounded-full px-8">
          Save
        </Button>
      </form>
    </div>
  );
}
