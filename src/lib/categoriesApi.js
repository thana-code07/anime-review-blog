import api from "@/lib/api";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data.categories ?? [];
}

export async function getCategories() {
  return fetchCategories();
}

export async function getCategoryNames() {
  const categories = await fetchCategories();
  return categories.map((category) => category.name);
}

export async function fetchCategory(id) {
  const categories = await fetchCategories();
  return (
    categories.find((category) => String(category.id) === String(id)) ?? null
  );
}

export async function getCategory(id) {
  return fetchCategory(id);
}

export async function createCategory({ name }) {
  const { data } = await api.post("/categories", { name });
  return data.category;
}

export async function updateCategory(id, { name }) {
  const { data } = await api.put(`/categories/${id}`, { name });
  return data.category;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
