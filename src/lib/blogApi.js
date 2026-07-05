import axios from "axios";

const blogApi = axios.create({
  baseURL: "https://blog-post-project-api.vercel.app",
});

export async function fetchPosts({ category, keyword, page = 1, limit = 6 } = {}) {
  const params = { page, limit };
  if (category && category !== "highlight") {
    params.category = category;
  }
  if (keyword?.trim()) {
    params.keyword = keyword.trim();
  }

  const { data } = await blogApi.get("/posts", { params });
  return data;
}

export async function fetchPost(postId) {
  const { data } = await blogApi.get(`/posts/${postId}`);
  return data;
}
