import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = [
  { value: "highlight", label: "Highlight" },
  { value: "cat", label: "Cat" },
  { value: "inspiration", label: "Inspiration" },
  { value: "general", label: "General" },
];

function ArticleSearchInput({ value, onChange, className }) {
  return (
    <div className={className}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 rounded-xl border-brown-300 bg-white pr-10 text-brown-900 placeholder:text-brown-400 focus-visible:border-brown-400 focus-visible:ring-brown-300/30 lg:h-10 lg:w-[280px]"
          aria-label="Search articles"
        />
        <Search
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-brown-400"
          aria-hidden
        />
      </div>
    </div>
  );
}

export function ArticlesSection() {
  const [category, setCategory] = useState("highlight");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="w-full bg-brown-200" aria-label="Latest articles">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12 lg:px-[120px] lg:py-16">
        <h2 className="font-poppins text-2xl font-bold text-brown-900 sm:text-[28px]">
          Latest articles
        </h2>

        <div className="mt-6 flex flex-col gap-4 lg:hidden">
          <ArticleSearchInput value={searchQuery} onChange={setSearchQuery} />

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
                {CATEGORIES.map(({ value, label }) => (
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
              {CATEGORIES.map(({ value, label }) => (
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

          <ArticleSearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
    </section>
  );
}
