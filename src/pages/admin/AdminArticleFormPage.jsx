import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { DeleteArticleDialog } from "@/components/DeleteArticleDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryNames } from "@/lib/adminCategories";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
} from "@/lib/adminArticles";

const MAX_INTRO_LENGTH = 120;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const inputClassName =
  "h-12 rounded-lg border border-brown-300 bg-white px-4 py-3 text-base text-brown-900 placeholder:text-brown-600 focus-visible:border-brown-500 focus-visible:ring-brown-500/20 md:text-base";

const textareaClassName =
  "w-full rounded-lg border border-brown-300 bg-white px-4 py-3 text-base text-brown-900 placeholder:text-brown-600 outline-none focus-visible:border-brown-500 focus-visible:ring-2 focus-visible:ring-brown-500/20";

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

function emptyForm(author) {
  return {
    title: "",
    category: "",
    author,
    description: "",
    content: "",
    image: null,
  };
}

function validateArticleForm(form, { requirePublishFields }) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  }

  if (requirePublishFields) {
    if (!form.category) {
      errors.category = "Category is required";
    }
    if (!form.content.trim()) {
      errors.content = "Content is required";
    }
  }

  if (form.description.length > MAX_INTRO_LENGTH) {
    errors.description = `Introduction must be ${MAX_INTRO_LENGTH} characters or fewer`;
  }

  return errors;
}

// admin create/edit article form
export function AdminArticleFormPage() {
  const { articleId } = useParams();
  const isEdit = Boolean(articleId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => emptyForm(user?.name ?? ""));
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryNames] = useState(() => getCategoryNames());

  useEffect(() => {
    if (!isEdit) {
      setForm(emptyForm(user?.name ?? ""));
      setNotFound(false);
      return;
    }

    const article = getArticle(articleId);
    if (!article) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setForm({
      title: article.title ?? "",
      category: article.category ?? "",
      author: article.author || user?.name || "",
      description: article.description ?? "",
      content: article.content ?? "",
      image: article.image ?? null,
    });
  }, [articleId, isEdit, user?.name]);

  function handleChange(field) {
    return (event) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
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
        image: "Please select an image file",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be 2MB or smaller",
      }));
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function save(status) {
    const requirePublishFields = status === "Published";
    const validationErrors = validateArticleForm(form, {
      requirePublishFields,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title,
      category: form.category,
      author: form.author || user?.name || "",
      description: form.description,
      content: form.content,
      image: form.image,
      status,
    };

    if (isEdit) {
      const updated = updateArticle(articleId, payload);
      if (!updated) {
        toast.error("Failed to save article", {
          description: "This article could not be found.",
        });
        return;
      }
      toast.success(
        status === "Draft" ? "Saved as draft" : "Article saved",
        {
          description:
            status === "Draft"
              ? "Your draft has been updated."
              : "Your article has been saved.",
          classNames: successToastClassNames,
        },
      );
    } else {
      createArticle(payload);
      toast.success(
        status === "Draft" ? "Saved as draft" : "Article published",
        {
          description:
            status === "Draft"
              ? "Your draft has been saved."
              : "Your article has been published.",
          classNames: successToastClassNames,
        },
      );
    }

    navigate("/admin/articles");
  }

  function handleDeleteConfirm() {
    const removed = deleteArticle(articleId);
    setDeleteOpen(false);
    if (!removed) {
      toast.error("Failed to delete article");
      return;
    }
    toast.success("Article deleted", {
      description: "The article has been removed.",
      classNames: successToastClassNames,
    });
    navigate("/admin/articles");
  }

  if (notFound) {
    return (
      <div className="px-6 py-8 sm:px-10 lg:px-12">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900">
          Article not found
        </h1>
        <p className="mt-2 text-brown-600">
          This article may have been deleted.
        </p>
        <Button
          type="button"
          className="mt-6"
          onClick={() => navigate("/admin/articles")}
        >
          Back to articles
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900 sm:text-3xl">
          {isEdit ? "Edit article" : "Create article"}
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-brown-900 bg-white text-brown-900 hover:bg-brown-100"
            onClick={() => save("Draft")}
          >
            Save as draft
          </Button>
          <Button type="button" onClick={() => save("Published")}>
            {isEdit ? "Save" : "Save and publish"}
          </Button>
        </div>
      </div>

      <form
        className="mx-auto max-w-3xl space-y-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <div className="space-y-2">
          <Label className="text-brown-600">Thumbnail image</Label>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-brown-100 sm:h-44">
              {form.image ? (
                <img
                  src={form.image}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <ImageIcon
                  className="size-10 text-brown-400"
                  strokeWidth={1.25}
                  aria-hidden
                />
              )}
            </div>
            <div className="space-y-2">
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
                className="rounded-full border-brown-900 bg-white text-brown-900 hover:bg-brown-100"
                onClick={handleUploadClick}
              >
                Upload thumbnail image
              </Button>
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image}</p>
              )}
            </div>
          </div>
        </div>

        <FormField id="category" label="Category" error={errors.category}>
          <Select
            value={form.category || undefined}
            onValueChange={(value) => {
              setForm((prev) => ({ ...prev, category: value }));
              setErrors((prev) => ({ ...prev, category: undefined }));
            }}
          >
            <SelectTrigger
              id="category"
              className="h-12 w-full rounded-lg border border-brown-300 bg-white px-4 text-brown-900 data-placeholder:text-brown-600"
              aria-label="Category"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryNames.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="author" label="Author name">
          <Input
            id="author"
            value={form.author}
            readOnly
            className={`${inputClassName} bg-brown-100 text-brown-800`}
          />
        </FormField>

        <FormField id="title" label="Title" error={errors.title}>
          <Input
            id="title"
            placeholder="Article title"
            value={form.title}
            onChange={handleChange("title")}
            className={inputClassName}
          />
        </FormField>

        <FormField
          id="description"
          label={`Introduction (max ${MAX_INTRO_LENGTH} letters)`}
          error={errors.description}
        >
          <textarea
            id="description"
            rows={3}
            maxLength={MAX_INTRO_LENGTH}
            placeholder="Introduction"
            value={form.description}
            onChange={handleChange("description")}
            className={textareaClassName}
          />
        </FormField>

        <FormField id="content" label="Content" error={errors.content}>
          <textarea
            id="content"
            rows={14}
            placeholder="Content"
            value={form.content}
            onChange={handleChange("content")}
            className={textareaClassName}
          />
        </FormField>

        {isEdit && (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 text-base text-brown-600 transition-colors hover:text-brown-900"
          >
            <Trash2 className="size-4 stroke-[1.5]" aria-hidden />
            Delete article
          </button>
        )}
      </form>

      {isEdit && (
        <DeleteArticleDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
