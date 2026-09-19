import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner.tsx";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Toaster duration={4000} position="top-center" />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
