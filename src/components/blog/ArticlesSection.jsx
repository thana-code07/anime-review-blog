import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleSearch } from "@/components/blog/ArticleSearch";
import BlogCard from "@/components/blog/BlogCard";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { fetchPosts } from "@/lib/blogApi";
import { fetchCategories } from "@/lib/categoriesApi";
import { formatPostDate } from "@/lib/formatDate";

function formatPosts(posts) {
  return posts.map((post) => ({
    ...post,
    date: formatPostDate(post.date),
  }));
}

// article list with category tabs, search, and pagination
export function ArticlesSection() {
  const [categories, setCategories] = useState([
    { value: "highlight", label: "Highlight" },
  ]);
  const [category, setCategory] = useState("highlight");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const rows = await fetchCategories();
        if (cancelled) return;

        setCategories([
          { value: "highlight", label: "Highlight" },
          ...rows.map((item) => ({
            value: item.name,
            label: item.name,
          })),
        ]);
      } catch {
        if (!cancelled) {
          setCategories([{ value: "highlight", label: "Highlight" }]);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      setPosts([]);
      setPage(1);
      setHasMore(false);

      try {
        const data = await fetchPosts({ category, page: 1, limit: 6 });
        if (cancelled) return;
        setPosts(formatPosts(data.posts));
        setHasMore(data.nextPage != null);
      } catch {
        if (cancelled) return;
        setPosts([]);
        setError("Failed to load articles.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [category]);

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const data = await fetchPosts({ category, page: nextPage, limit: 6 });
      setPosts((prev) => [...prev, ...formatPosts(data.posts)]);
      setPage(nextPage);
      setHasMore(data.nextPage != null);
    } catch {
      setError("Failed to load more articles.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <section className="w-full bg-brown-200" aria-label="Latest articles">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12 lg:px-[120px] lg:py-16">
        <h2 className="font-poppins text-2xl font-bold text-brown-900 sm:text-[28px]">
          Latest articles
        </h2>

        <div className="mt-6 flex flex-col gap-4 lg:hidden">
          <ArticleSearch />

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="article-category"
              className="text-sm font-normal text-brown-600"
            >
              Category
            </Label>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="article-category"
                className="h-11 w-full rounded-xl border-brown-300 bg-white text-brown-900"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 hidden items-center justify-between gap-4 rounded-full bg-brown-100 px-4 py-3 lg:flex">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="h-auto gap-1 bg-transparent p-0">
              {categories.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-brown-600 data-active:bg-brown-300 data-active:text-brown-900 data-active:shadow-none"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <ArticleSearch />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {isLoading && (
            <div className="col-span-full flex justify-center py-16">
              <LoadingSpinner />
            </div>
          )}

          {error && <p className="col-span-full text-red-600">{error}</p>}

          {!isLoading &&
            !error &&
            posts.map((post) => (
              <BlogCard key={post.id} id={post.id} {...post} />
            ))}
        </div>

        {!isLoading && isLoadingMore && (
          <div className="mt-10 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && !isLoadingMore && hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="rounded-xl bg-white px-10 py-3 text-brown-900 underline hover:text-brown-600 cursor-pointer"
            >
              View more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
