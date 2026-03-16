export const primaryPagePaths = {
  about: "/about",
  destinations: "/destinations",
  schedule: "/schedule",
  partners: "/partners",
  leadership: "/leadership",
  contact: "/contact",
  blog: "/blog",
} as const;

export type PrimaryPageKey = keyof typeof primaryPagePaths;
