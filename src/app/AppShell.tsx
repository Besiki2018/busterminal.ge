import type { ReactNode } from "react";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppRoutes } from "@/app/AppRoutes";

type AppShellProps = {
  queryClient: QueryClient;
  dehydratedState?: unknown;
  children: ReactNode;
};

export const AppShell = ({ queryClient, dehydratedState, children }: AppShellProps) => (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={dehydratedState}>
      {children}
    </HydrationBoundary>
  </QueryClientProvider>
);

export const RoutedAppContent = () => (
  <LanguageProvider>
    <TooltipProvider>
      {typeof window !== "undefined" ? (
        <>
          <Toaster />
          <Sonner />
        </>
      ) : null}
      <AppRoutes />
    </TooltipProvider>
  </LanguageProvider>
);
