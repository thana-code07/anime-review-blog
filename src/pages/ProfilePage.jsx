import { useRef, useState } from "react";
import { toast } from "sonner";

import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_AVATAR,
  inputClassName,
  successToastClassNames,
} from "@/lib/constants";
import { validateProfileForm } from "@/lib/validation";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

// edit profile name, username, and avatar
export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name ?? "",
    username: user.username ?? "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setErrors((prev) => ({ ...prev, avatar: undefined }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateProfileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Do not send the local FileReader data URL as profile_pic — only the File
    // (uploaded to storage) or omit avatar entirely for name/username-only saves.
    const result = await updateProfile({
      name: form.name,
      username: form.username,
      avatarFile,
    });
    setIsSubmitting(false);

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

    setAvatarFile(null);
    setAvatarPreview(result.user.avatar || null);

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

        <Button
          type="submit"
          variant="primary"
          className="rounded-full px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
