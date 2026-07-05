export function formatPostDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatLikes(likes) {
  if (likes >= 1000) {
    return `${(likes / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(likes);
}
