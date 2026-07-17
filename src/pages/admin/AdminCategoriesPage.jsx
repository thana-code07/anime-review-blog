import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { DeleteCategoryDialog } from "@/components/DeleteCategoryDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  deleteCategory,
  getCategories,
} from "@/lib/adminCategories";

const successToastClassNames = {
  toast: "bg-[#31dc70] text-white border-none",
  title: "text-white font-bold text-lg",
  description: "!text-white text-[15px] leading-normal",
  closeButton:
    "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
};

// admin list of categories with search, edit, and delete
export function AdminCategoriesPage() {
  const [categories, setCategories] = useState(() => getCategories());
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refreshCategories = useCallback(() => {
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, search]);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const result = deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    refreshCategories();
    toast.success("Delete category", {
      description: "Category has been successfully deleted.",
      classNames: successToastClassNames,
    });
  }

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900 sm:text-3xl">
          Category management
        </h1>
        <Button asChild className="gap-2 self-start sm:self-auto">
          <Link to="/admin/categories/new">
            <Plus className="size-4" aria-hidden />
            Create category
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brown-600"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 rounded-lg border border-brown-300 bg-white pl-9 text-brown-800 placeholder:text-brown-600 focus-visible:border-brown-500 focus-visible:ring-brown-500/20"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-brown-200">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brown-200 bg-brown-100">
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Category
              </th>
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr
                key={category.id}
                className={
                  index % 2 === 0 ? "bg-white" : "bg-brown-100/70"
                }
              >
                <td className="px-4 py-4 text-base text-brown-900">
                  {category.name}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className="inline-flex size-8 items-center justify-center rounded-md text-brown-600 transition-colors hover:bg-brown-200 hover:text-brown-900"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil className="size-4 stroke-[1.5]" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-brown-600 transition-colors hover:bg-brown-200 hover:text-brown-900"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => setDeleteTarget(category)}
                    >
                      <Trash2 className="size-4 stroke-[1.5]" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-10 text-center text-base text-brown-600"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteCategoryDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
