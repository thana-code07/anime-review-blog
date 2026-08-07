import api from "@/lib/api";

// fetch paginated posts from the blog API
export async function fetchPosts({
  category,
  keyword,
  page = 1,
  limit = 6,
  status,
} = {}) {
  const params = { page, limit };
  if (category && category !== "highlight") {
    params.category = category;
  }
  if (keyword?.trim()) {
    params.keyword = keyword.trim();
  }
  if (status) {
    params.status = status;
  }

  const { data } = await api.get("/posts", { params });
  return data;
}

// fetch one post by id from the blog API
export async function fetchPost(postId) {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post("/posts", payload);
  return data;
}

export async function updatePost(postId, payload) {
  const { data } = await api.put(`/posts/${postId}`, payload);
  return data;
}

export async function deletePost(postId) {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
}

export async function fetchComments(postId) {
  const { data } = await api.get(`/posts/${postId}/comments`);
  return data.comments ?? [];
}

export async function createComment(postId, comment_text) {
  const { data } = await api.post(`/posts/${postId}/comments`, {
    comment_text,
  });
  return data.comment;
}

export async function deleteComment(postId, commentId) {
  const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return data;
}

export async function likePost(postId) {
  const { data } = await api.post(`/posts/${postId}/likes`);
  return data;
}

export async function unlikePost(postId) {
  const { data } = await api.delete(`/posts/${postId}/likes`);
  return data;
}

export async function uploadPostImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  // Do not set Content-Type manually — browser must include the multipart boundary
  const { data } = await api.post("/uploads/post-image", formData);
  if (!data?.url || typeof data.url !== "string") {
    throw new Error("Upload succeeded but no image URL was returned");
  }
  return data.url;
}
