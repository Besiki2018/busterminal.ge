import { useEffect } from "react";
import { getAdminUrl } from "@/lib/backend";

const Admin = () => {
  const adminUrl = getAdminUrl();

  useEffect(() => {
    window.location.replace(adminUrl);
  }, [adminUrl]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-card">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Laravel Admin</p>
        <h1 className="mt-4 text-3xl font-heading font-bold text-foreground">Redirecting to admin panel</h1>
        <p className="mt-4 text-muted-foreground">
          If the redirect does not happen automatically, use the link below.
        </p>
        <a
          href={adminUrl}
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Open Admin
        </a>
      </div>
    </section>
  );
};

export default Admin;
