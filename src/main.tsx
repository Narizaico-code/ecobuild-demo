import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { hydrateCatalog } from "./lib/hydrate";
import "./index.css";
import "./demo.css";

const root = document.getElementById("root")!;

hydrateCatalog().finally(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
