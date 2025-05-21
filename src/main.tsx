import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/utils/service/sockjs-setup";

import "@/index.css";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
