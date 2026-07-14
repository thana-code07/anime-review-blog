import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";

const MOCK_CATEGORIES = [
  { id: "1", name: "Cat", articleCount: 12 },
  { id: "2", name: "General", articleCount: 8 },
  { id: "3", name: "Inspiration", articleCount: 5 },
  { id: "4", name: "Highlight", articleCount: 3 },
];

// admin categories list (mock data)
export function AdminCategoriesPage() {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-poppins text-2xl font-semibold text-brown-900 sm:text-3xl">
          Category management
        </h1>
        <Button type="button" className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" aria-hidden />
          Create category
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-brown-200">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brown-200 bg-brown-100">
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Category
              </th>
              <th className="px-4 py-3 text-sm font-medium text-brown-600">
                Articles
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CATEGORIES.map((category, index) => (
              <tr
                key={category.id}
                className={
                  index % 2 === 0 ? "bg-white" : "bg-brown-100/70"
                }
              >
                <td className="px-4 py-4 text-base text-brown-900">
                  {category.name}
                </td>
                <td className="px-4 py-4 text-base text-brown-800">
                  {category.articleCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
