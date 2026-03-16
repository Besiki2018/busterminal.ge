import type { ComponentProps, ReactNode } from "react";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import type { HomePageCms } from "@/lib/cms";

type SectionPageShellProps = {
  cms: HomePageCms;
  children: ReactNode;
  seo: ComponentProps<typeof Seo>;
};

export const SectionPageShell = ({ cms, children, seo }: SectionPageShellProps) => {
  return (
    <SiteLayout cms={cms}>
      <Seo {...seo} />
      <div className="pt-20 md:pt-24">{children}</div>
    </SiteLayout>
  );
};
