import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { getPrerenderPayload } from "@/lib/prerender-state";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container was not found.");
}

const prerenderPayload = getPrerenderPayload();
const app = <App dehydratedState={prerenderPayload?.dehydratedState} />;

if (container.hasChildNodes() && prerenderPayload?.hydrate) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
