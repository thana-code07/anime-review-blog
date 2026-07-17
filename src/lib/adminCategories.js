import { getArticles, renameArticlesCategory } from "@/lib/adminArticles";

const CATEGORIES_KEY = "adminCategories";

const SEED_CATEGORIES = [
  { id: "1", name: "Cat" },
  { id: "2", name: "General" },
  { id: "3", name: "Inspiration" },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  const existing = readJson(CATEGORIES_KEY, null);
  if (existing === null) {
    writeJson(CATEGORIES_KEY, SEED_CATEGORIES);
    return SEED_CATEGORIES;
  }
  return existing;
}

function nextId(categories) {
  const maxId = categories.reduce((max, category) => {
    const numeric = Number(category.id);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);
  return String(maxId + 1);
}

function normalizeName(name) {
  return name?.trim() ?? "";
}

function isDuplicateName(categories, name, excludeId) {
  const lower = name.toLowerCase();
  return categories.some(
    (category) =>
      String(category.id) !== String(excludeId) &&
      category.name.toLowerCase() === lower,
  );
}

function categoryInUse(name) {
  return getArticles().some(
    (article) => article.category.toLowerCase() === name.toLowerCase(),
  );
}

// read all admin categories from localStorage
export function getCategories() {
  return ensureSeeded();
}

// category names for article selects/filters
export function getCategoryNames() {
  return getCategories().map((category) => category.name);
}

// read one admin category by id
export function getCategory(id) {
  return (
    getCategories().find((category) => String(category.id) === String(id)) ??
    null
  );
}

// create a new admin category in localStorage
export function createCategory(data) {
  const name = normalizeName(data.name);
  if (!name) {
    return { error: "Category name is required" };
  }

  const categories = getCategories();
  if (isDuplicateName(categories, name)) {
    return { error: "A category with this name already exists" };
  }

  const category = {
    id: nextId(categories),
    name,
  };
  writeJson(CATEGORIES_KEY, [...categories, category]);
  return { category };
}

// update an existing admin category in localStorage
export function updateCategory(id, data) {
  const name = normalizeName(data.name);
  if (!name) {
    return { error: "Category name is required" };
  }

  const categories = getCategories();
  const index = categories.findIndex(
    (category) => String(category.id) === String(id),
  );
  if (index === -1) {
    return { error: "Category not found" };
  }

  if (isDuplicateName(categories, name, id)) {
    return { error: "A category with this name already exists" };
  }

  const previousName = categories[index].name;
  const updated = { ...categories[index], name };
  const next = [...categories];
  next[index] = updated;
  writeJson(CATEGORIES_KEY, next);

  if (previousName !== name) {
    renameArticlesCategory(previousName, name);
  }

  return { category: updated };
}

// delete an admin category from localStorage
export function deleteCategory(id) {
  const categories = getCategories();
  const category = categories.find(
    (item) => String(item.id) === String(id),
  );
  if (!category) {
    return { error: "Category not found" };
  }

  if (categoryInUse(category.name)) {
    return {
      error: "Cannot delete a category that is still used by articles",
    };
  }

  const next = categories.filter(
    (item) => String(item.id) !== String(id),
  );
  writeJson(CATEGORIES_KEY, next);
  return { ok: true };
}
