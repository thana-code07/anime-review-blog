import {
  createPost,
  deletePost,
  fetchPost,
  fetchPosts,
  updatePost,
  uploadPostImage,
} from "@/lib/blogApi";
import { fetchCategories } from "@/lib/categoriesApi";
import {
  fetchStatuses,
  statusIdFromLabel,
  statusLabelFromDb,
} from "@/lib/statusesApi";

export const ARTICLE_STATUSES = ["Published", "Draft"];

const DRAFT_PLACEHOLDER_IMAGE =
  "https://placehold.co/1200x675/e8e2d9/534b42?text=Draft";

function mapPostToArticle(post) {
  return {
    id: String(post.id),
    title: post.title ?? "",
    category: post.category ?? "",
    status: statusLabelFromDb(post.status),
    image: post.image ?? null,
    description: post.description ?? "",
    content: post.content ?? "",
    date: post.date,
    category_id: post.category_id,
    status_id: post.status_id,
    likes_count: post.likes_count ?? 0,
  };
}

export async function getArticles({
  keyword,
  category,
  status = "all",
  page = 1,
  limit = 100,
} = {}) {
  const statusParam =
    status === "published"
      ? "publish"
      : status === "draft"
        ? "draft"
        : "all";

  const data = await fetchPosts({
    keyword,
    category: category === "all" ? undefined : category,
    status: statusParam,
    page,
    limit,
  });

  return (data.posts ?? []).map(mapPostToArticle);
}

export async function getArticle(id) {
  const post = await fetchPost(id);
  return mapPostToArticle(post);
}

async function resolveIds({ categoryName, statusLabel }) {
  const [categories, statuses] = await Promise.all([
    fetchCategories(),
    fetchStatuses(),
  ]);

  if (!categoryName?.trim()) {
    throw new Error("Select a category");
  }

  if (categories.length === 0) {
    throw new Error("No categories available. Create a category first.");
  }

  const category = categories.find(
    (item) => item.name.toLowerCase() === categoryName.trim().toLowerCase(),
  );

  if (!category) {
    throw new Error("Selected category was not found");
  }

  const status_id = statusIdFromLabel(statuses, statusLabel);
  if (!status_id) {
    throw new Error("Selected status was not found");
  }

  return { category_id: category.id, status_id };
}

export async function saveArticle({
  id,
  title,
  category,
  description,
  content,
  image,
  imageFile,
  status,
}) {
  let imageUrl = image;

  if (imageFile instanceof File) {
    imageUrl = await uploadPostImage(imageFile);
  }

  if (!imageUrl) {
    imageUrl = DRAFT_PLACEHOLDER_IMAGE;
  }

  const { category_id, status_id } = await resolveIds({
    categoryName: category,
    statusLabel: status,
  });

  const payload = {
    title: title.trim(),
    image: imageUrl,
    category_id,
    description: description?.trim() || "(No introduction)",
    content: content?.trim() || "(No content)",
    status_id,
  };

  if (id) {
    await updatePost(id, payload);
    return { id: String(id), image: imageUrl };
  }

  await createPost(payload);
  return { image: imageUrl };
}

export async function removeArticle(id) {
  await deletePost(id);
  return true;
}
