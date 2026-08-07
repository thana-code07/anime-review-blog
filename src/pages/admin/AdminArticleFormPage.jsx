import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ArticleFormFields } from "@/components/admin/ArticleFormFields";
import { ArticleThumbnailField } from "@/components/admin/ArticleThumbnailField";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import {
  getArticle,
  removeArticle,
  saveArticle,
} from "@/lib/adminArticles";
import { getApiErrorMessage } from "@/lib/api";
import { getCategoryNames } from "@/lib/categoriesApi";
import { successToastClassNames } from "@/lib/constants";
import { validateArticleForm } from "@/lib/validation";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

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

// admin create/edit article form
export function AdminArticleFormPage() {
  const { articleId } = useParams();
  const isEdit = Boolean(articleId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => emptyForm(user?.name ?? ""));
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const names = await getCategoryNames();
        if (!cancelled) {
          setCategoryNames(names);
        }
      } catch {
        if (!cancelled) {
          setCategoryNames([]);
        }
      }

      if (!isEdit) {
        if (!cancelled) {
          setForm(emptyForm(user?.name ?? ""));
          setImageFile(null);
          setNotFound(false);
        }
        return;
      }

      try {
        const article = await getArticle(articleId);
        if (cancelled) return;
        setNotFound(false);
        setForm({
          title: article.title ?? "",
          category: article.category ?? "",
          author: user?.name || "",
          description: article.description ?? "",
          content: article.content ?? "",
          image: article.image ?? null,
        });
        setImageFile(null);
      } catch {
        if (!cancelled) {
          setNotFound(true);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
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

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }

  async function save(status) {
    const requirePublishFields = status === "Published";
    const validationErrors = validateArticleForm(
      { ...form, imageFile },
      { requirePublishFields },
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      await saveArticle({
        id: isEdit ? articleId : null,
        title: form.title,
        category: form.category,
        description: form.description,
        content: form.content,
        image: typeof form.image === "string" && form.image.startsWith("http")
          ? form.image
          : null,
        imageFile,
        status,
      });

      toast.success(
        status === "Draft"
          ? "Saved as draft"
          : isEdit
            ? "Article saved"
            : "Article published",
        {
          description:
            status === "Draft"
              ? "Your draft has been saved."
              : "Your article has been saved.",
          classNames: successToastClassNames,
        },
      );
      navigate("/admin/articles");
    } catch (error) {
      toast.error("Failed to save article", {
        description: getApiErrorMessage(error, "Please try again."),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    try {
      await removeArticle(articleId);
      setDeleteOpen(false);
      toast.success("Article deleted", {
        description: "The article has been removed.",
        classNames: successToastClassNames,
      });
      navigate("/admin/articles");
    } catch {
      setDeleteOpen(false);
      toast.error("Failed to delete article");
    }
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
            disabled={isSaving}
            onClick={() => save("Draft")}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            disabled={isSaving}
            onClick={() => save("Published")}
          >
            {isEdit ? "Save" : "Save and publish"}
          </Button>
        </div>
      </div>

      <form
        className="mx-auto max-w-3xl space-y-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <ArticleThumbnailField
          image={form.image}
          error={errors.image}
          fileInputRef={fileInputRef}
          onUploadClick={handleUploadClick}
          onFileChange={handleFileChange}
        />

        <ArticleFormFields
          form={form}
          errors={errors}
          categoryNames={categoryNames}
          onChange={handleChange}
          onCategoryChange={(value) => {
            setForm((prev) => ({ ...prev, category: value }));
            setErrors((prev) => ({ ...prev, category: undefined }));
          }}
        />

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
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete article"
          description="Do you want to delete this article?"
        />
      )}
    </div>
  );
}
