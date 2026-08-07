import { useEffect, useRef, useState } from "react";

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
import { useSiteAuthorAvatar } from "@/hooks/useSiteAuthorAvatar";
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
  const authorAvatar = useSiteAuthorAvatar();
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
  const listRequestIdRef = useRef(0);

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
    const requestId = ++listRequestIdRef.current;

    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      setPosts([]);
      setPage(1);
      setHasMore(false);
      setIsLoadingMore(false);

      try {
        const data = await fetchPosts({ category, page: 1, limit: 6 });
        if (requestId !== listRequestIdRef.current) return;
        setPosts(formatPosts(data.posts));
        setHasMore(data.nextPage != null);
      } catch {
        if (requestId !== listRequestIdRef.current) return;
        setPosts([]);
        setError("Failed to load articles.");
      } finally {
        if (requestId === listRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();
  }, [category]);

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) return;

    const requestId = listRequestIdRef.current;
    const loadCategory = category;
    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    try {
      const data = await fetchPosts({
        category: loadCategory,
        page: nextPage,
        limit: 6,
      });
      if (requestId !== listRequestIdRef.current) return;
      setPosts((prev) => [...prev, ...formatPosts(data.posts)]);
      setPage(nextPage);
      setHasMore(data.nextPage != null);
    } catch {
      if (requestId !== listRequestIdRef.current) return;
      setError("Failed to load more articles.");
    } finally {
      if (requestId === listRequestIdRef.current) {
        setIsLoadingMore(false);
      }
    }
  }

  return (
    <section
      id="latest-articles"
      className="w-full scroll-mt-24 bg-brown-200"
      aria-label="Latest articles"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 sm:py-14 lg:px-[120px] lg:py-20">
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-brown-900 sm:text-[28px]">
          Latest articles
        </h2>

        <div className="mt-8 flex flex-col gap-4 lg:hidden">
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
                className="h-11 w-full rounded-xl border-brown-300 bg-brown-100 text-brown-900"
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

        <div className="mt-8 hidden items-center justify-between gap-4 rounded-full border border-brown-300/70 bg-brown-100/90 px-4 py-3 shadow-[0_1px_0_rgb(38_35_30/0.04)] lg:flex">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="h-auto gap-1 bg-transparent p-0">
              {categories.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-full px-4 py-2 text-sm font-medium text-brown-600 transition-colors hover:text-brown-900 data-active:bg-brown-900 data-active:text-white data-active:shadow-none data-active:hover:bg-brown-900 data-active:hover:text-white"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <ArticleSearch />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
          {isLoading && (
            <div className="col-span-full flex justify-center py-16">
              <LoadingSpinner />
            </div>
          )}

          {error && <p className="col-span-full text-red-600">{error}</p>}

          {!isLoading &&
            !error &&
            posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                {...post}
                authorAvatar={authorAvatar}
              />
            ))}
        </div>

        {!isLoading && isLoadingMore && (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && !isLoadingMore && hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="cursor-pointer rounded-full border border-brown-900 bg-brown-100 px-10 py-3 text-brown-900 transition-colors hover:bg-brown-900 hover:text-white"
            >
              View more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
