import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AdminModeProvider } from "./components/admin-mode-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <AdminModeProvider defaultMode="OFF" storageKey="vite-ui-admin-mode">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AdminModeProvider>
    </ConvexAuthProvider>
  </StrictMode>,
);
