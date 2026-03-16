import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { HomePageCms } from "@/lib/cms";

type SiteLayoutProps = {
  cms: HomePageCms;
  children: ReactNode;
};

export const SiteLayout = ({ cms, children }: SiteLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header contact={cms.contact} pages={cms.navigationPages} />
      <WhatsAppButton contact={cms.contact} />
      <main>{children}</main>
      <Footer content={cms.footer} contact={cms.contact} pages={cms.navigationPages} />
    </div>
  );
};
