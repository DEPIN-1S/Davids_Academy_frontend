export const PRODUCTION_UPLOADS_ORIGIN = "https://api.davids-academy.com";

export const apiOrigin = () =>
  (process.env.REACT_APP_API_URL || "").replace(/\/davidsacademy\/?$/, "");

const storyImagePath = (story) => {
  const raw = story?.imageUrl || story?.image || "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return raw.startsWith("/") ? raw : `/uploads/successimage/${raw}`;
};

export const successStoryImageSrc = (story) => {
  const pathOrUrl = storyImagePath(story);
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${apiOrigin()}${pathOrUrl}`;
};

export const successStoryImageFallback = (story) => {
  const pathOrUrl = storyImagePath(story);
  const filename = pathOrUrl.split("/").pop();
  return filename
    ? `${PRODUCTION_UPLOADS_ORIGIN}/uploads/successimage/${filename}`
    : "";
};
