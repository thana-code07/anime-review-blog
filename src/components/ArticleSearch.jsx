import { useEffect, useId, useRef, useState } from "react";

import { Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { fetchPosts } from "@/lib/blogApi";

const DEBOUNCE_MS = 300;

export function ArticleSearch({ className }) {
  const listboxId = useId();
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function search() {
      setIsLoading(true);

      try {
        const data = await fetchPosts({ keyword: trimmed, limit: 6 });
        if (!cancelled) {
          setResults(data.posts);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    search();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const trimmedQuery = query.trim();
  const showDropdown = isOpen && isFocused && trimmedQuery.length > 0;

  function handleChange(value) {
    setQuery(value);
    setIsOpen(true);
  }

  function handleSelect() {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setIsOpen(false);
    setIsFocused(false);
  }

  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (trimmedQuery.length > 0) {
              setIsOpen(true);
            }
          }}
          className="h-11 rounded-xl border-brown-300 bg-white pr-10 text-brown-900 placeholder:text-brown-400 focus-visible:border-brown-400 focus-visible:ring-brown-300/30 lg:h-10 lg:w-[280px]"
          aria-label="Search articles"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          role="combobox"
        />

        <Search
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brown-400"
          aria-hidden
        />

        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute top-[calc(100%+4px)] right-0 z-50 w-full overflow-hidden rounded-xl border border-brown-300 bg-white py-2 shadow-md lg:w-[280px]"
          >
            {isLoading && (
              <li className="flex justify-center px-4 py-3">
                <div
                  className="size-5 animate-spin rounded-full border-2 border-brown-900 border-t-transparent"
                  role="status"
                  aria-label="Loading search results"
                />
              </li>
            )}

            {!isLoading && results.length === 0 && (
              <li className="px-4 py-3 text-sm text-brown-600">No articles found</li>
            )}

            {!isLoading &&
              results.map((post) => (
                <li key={post.id} role="option" aria-selected={false}>
                  <Link
                    to={`/post/${post.id}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={handleSelect}
                    className="block rounded-lg px-4 py-2.5 text-sm text-brown-900 hover:text-brown-600"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
