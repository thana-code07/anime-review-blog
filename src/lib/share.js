export function buildShareUrl(platform, url) {
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/share.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "twitter":
      return `https://www.twitter.com/share?&url=${encodedUrl}`;
    default:
      return url;
  }
}
