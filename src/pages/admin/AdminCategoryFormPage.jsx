import { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api";
import {
  createCategory,
  getCategory,
  updateCategory,
} from "@/lib/categoriesApi";
import {
  adminInputClassName,
  successToastClassNames,
} from "@/lib/constants";

// admin create/edit category form
export function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const editMatch = useMatch("/admin/categories/:categoryId/edit");
  const isEdit = Boolean(editMatch);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isEdit) {
        setName("");
        setError("");
        setNotFound(false);
        return;
      }

      try {
        const category = await getCategory(categoryId);
        if (cancelled) return;
        if (!category) {
          setNotFound(true);
          return;
        }
        setNotFound(false);
        setName(category.name);
        setError("");
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
  }, [categoryId, isEdit]);

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (isEdit) {
        await updateCategory(categoryId, { name });
      } else {
        await createCategory({ name });
      }

      toast.success(isEdit ? "Edit category" : "Create category", {
        description: isEdit
          ? "Category has been successfully updated."
          : "Category has been successfully created.",
        classNames: successToastClassNames,
      });
      navigate("/admin/categories");
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to save category");
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (notFound) {
    return (
      <div className="px-6 py-8 sm:px-10 lg:px-12">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900">
          Category not found
        </h1>
        <Button
          type="button"
          className="mt-6"
          onClick={() => navigate("/admin/categories")}
        >
          Back to categories
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12">
      <form onSubmit={handleSave}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-poppins text-2xl font-semibold text-brown-900 sm:text-3xl">
            {isEdit ? "Edit category" : "Create category"}
          </h1>
          <Button
            type="submit"
            className="rounded-full px-8 self-start sm:self-auto"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="max-w-xl space-y-2">
          <Label htmlFor="category-name" className="text-brown-600">
            Category name
          </Label>
          <Input
            id="category-name"
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            className={adminInputClassName}
            aria-invalid={Boolean(error)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>
    </div>
  );
}
