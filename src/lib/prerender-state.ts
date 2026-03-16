export type PrerenderPayload = {
  hydrate?: boolean;
  dehydratedState?: unknown;
};

declare global {
  interface Window {
    __SEO_PRERENDER__?: PrerenderPayload;
  }
}

export const getPrerenderPayload = (): PrerenderPayload | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.__SEO_PRERENDER__;
};
