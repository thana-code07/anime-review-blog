import { useEffect, useState } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCategory,
  getCategory,
  updateCategory,
} from "@/lib/adminCategories";

const successToastClassNames = {
  toast: "bg-[#31dc70] text-white border-none",
  title: "text-white font-bold text-lg",
  description: "!text-white text-[15px] leading-normal",
  closeButton:
    "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
};

const inputClassName =
  "h-12 rounded-lg border border-brown-300 bg-white px-4 py-3 text-base text-brown-900 placeholder:text-brown-600 focus-visible:border-brown-500 focus-visible:ring-brown-500/20 md:text-base";

// admin create/edit category form
export function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const editMatch = useMatch("/admin/categories/:categoryId/edit");
  const isEdit = Boolean(editMatch);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setName("");
      setError("");
      setNotFound(false);
      return;
    }

    const category = getCategory(categoryId);
    if (!category) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setName(category.name);
    setError("");
  }, [categoryId, isEdit]);

  function handleSave(event) {
    event.preventDefault();

    const result = isEdit
      ? updateCategory(categoryId, { name })
      : createCategory({ name });

    if (result.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Edit category" : "Create category", {
      description: isEdit
        ? "Category has been successfully updated."
        : "Category has been successfully created.",
      classNames: successToastClassNames,
    });
    navigate("/admin/categories");
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
          >
            Save
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
            className={inputClassName}
            aria-invalid={Boolean(error)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </form>
    </div>
  );
}
