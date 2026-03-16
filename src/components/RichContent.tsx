import DOMPurify from "dompurify";
import type { ElementType } from "react";
import { cn } from "@/lib/utils";

type RichContentProps = {
  html?: string | null;
  className?: string;
  as?: ElementType;
};

export const RichContent = ({ html, className, as: Component = "div" }: RichContentProps) => {
  const sanitizedHtml =
    typeof window === "undefined"
      ? (html ?? "")
      : DOMPurify.sanitize(html ?? "", {
          USE_PROFILES: { html: true },
        });

  if (!sanitizedHtml.trim()) {
    return null;
  }

  return (
    <Component
      className={cn("bt-rich-content", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
