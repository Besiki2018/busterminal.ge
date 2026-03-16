import { QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppShell, RoutedAppContent } from "@/app/AppShell";

const queryClient = new QueryClient();

type AppProps = {
  dehydratedState?: unknown;
};

const App = ({ dehydratedState }: AppProps) => (
  <AppShell queryClient={queryClient} dehydratedState={dehydratedState}>
    <BrowserRouter>
      <RoutedAppContent />
    </BrowserRouter>
  </AppShell>
);

export default App;
