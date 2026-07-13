import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { DeleteArticleDialog } from "@/components/DeleteArticleDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_STATUSES,
  deleteArticle,
  getArticles,
} from "@/lib/adminArticles";

const successToastClassNames = {
  toast: "bg-[#31dc70] text-white border-none",
  title: "text-white font-bold text-lg",
  description: "!text-white text-[15px] leading-normal",
  closeButton:
    "!bg-transparent !border-none !text-white !shadow-none !left-auto !right-3 !top-3 !transform-none rounded",
};

function StatusBadge({ status }) {
  const isPublished = status === "Published";

  return (
    <span
      className={
        isPublished
          ? "inline-flex items-center gap-2 text-base text-green-500"
          : "inline-flex items-center gap-2 text-base text-brown-600"
      }
    >
      <span
        className={
          isPublished
            ? "size-2 rounded-full bg-green-500"
            : "size-2 rounded-full bg-brown-500"
        }
        aria-hidden
      />
      {status}
    </span>
  );
}

export function AdminArticlesPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(() => getArticles());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refreshArticles = useCallback(() => {
    setArticles(getArticles());
  }, []);

  useEffect(() => {
    refreshArticles();
  }, [refreshArticles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query || article.title.toLowerCase().includes(query);
      const matchesStatus =
        status === "all" || article.status.toLowerCase() === status;
      const matchesCategory =
        category === "all" ||
        article.category.toLowerCase() === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, search, status, category]);

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const removed = deleteArticle(deleteTarget.id);
    setDeleteTarget(null);
    if (!removed) {
      toast.error("Failed to delete article");
      return;
    }
    refreshArticles();
    toast.success("Article deleted", {
      description: "The article has been removed.",
      classNames: successToastClassNames,
    });
  }

  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900 sm:text-3xl">
          Article management
        </h1>
        <Button
          type="button"
          className="gap-2 self-start sm:self-auto"
          onClick={() => navigate("/admin/articles/new")}
        >
          <Plus className="size-4" aria-hidden />
          Create article
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
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

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className="h-10 w-full rounded-lg border border-brown-300 bg-white px-3 text-brown-800 data-placeholder:text-brown-600 lg:w-40"
            aria-label="Status"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            {ARTICLE_STATUSES.map((item) => (
              <SelectItem key={item} value={item.toLowerCase()}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger
            className="h-10 w-full rounded-lg border border-brown-300 bg-white px-3 text-brown-800 data-placeholder:text-brown-600 lg:w-44"
            aria-label="Category"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category</SelectItem>
            {ARTICLE_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item.toLowerCase()}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-brown-200">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brown-200 bg-brown-100">
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Article title
              </th>
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Category
              </th>
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article, index) => (
              <tr
                key={article.id}
                className={
                  index % 2 === 0 ? "bg-white" : "bg-brown-100/70"
                }
              >
                <td className="max-w-md px-4 py-4 text-base text-brown-900">
                  {article.title}
                </td>
                <td className="px-4 py-4 text-base text-brown-800">
                  {article.category}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={article.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-brown-600 transition-colors hover:bg-brown-200 hover:text-brown-900"
                      aria-label={`Edit ${article.title}`}
                      onClick={() =>
                        navigate(`/admin/articles/${article.id}/edit`)
                      }
                    >
                      <Pencil className="size-4 stroke-[1.5]" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-brown-600 transition-colors hover:bg-brown-200 hover:text-brown-900"
                      aria-label={`Delete ${article.title}`}
                      onClick={() => setDeleteTarget(article)}
                    >
                      <Trash2 className="size-4 stroke-[1.5]" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredArticles.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-base text-brown-600"
                >
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteArticleDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
