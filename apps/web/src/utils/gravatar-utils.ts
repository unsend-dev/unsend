import crypto from "crypto";

/**
 * Possible Gravatar rating values: 'g' (general), 'pg' (parental guidance),
 * 'r' (restricted), or 'x' (explicit).
 */
export type GravatarRating = "g" | "pg" | "r" | "x";

/**
 * Common default image options in Gravatar.
 * Can also be a URL (string) for a custom default image.
 */
export type GravatarDefaultImage =
  | "404"
  | "mp"
  | "identicon"
  | "monsterid"
  | "wavatar"
  | "retro"
  | "robohash"
  | "blank";

export interface GravatarOptions {
  size?: number; // specify the size (in pixels)
  defaultImage?: GravatarDefaultImage; // default image
  rating?: GravatarRating; // image rating
}

export function getGravatarUrl(
  email: string,
  options: GravatarOptions = {
    size: 80,
    defaultImage: "identicon",
    rating: "g",
  },
) {
  const trimmedEmail = email.trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(trimmedEmail).digest("hex");

  // Base Gravatar URL
  const baseUrl = "https://www.gravatar.com/avatar/";

  // Use URLSearchParams to build query string
  const queryParams = new URLSearchParams();

  if (options.size) {
    queryParams.set("s", options.size.toString());
  }
  if (options.defaultImage) {
    queryParams.set("d", options.defaultImage);
  }
  if (options.rating) {
    queryParams.set("r", options.rating);
  }

  const queryString = queryParams.toString();
  const finalUrl = queryString
    ? `${baseUrl}${hash}?${queryString}`
    : `${baseUrl}${hash}`;

  return finalUrl;
}
