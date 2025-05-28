import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "./index.css";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "../src/components/ui/theme-provider";
import { AdminModeProvider } from "../src/components/admin-mode-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export default function App() {
  return (
    <>
      <ConvexAuthProvider client={convex}>
        <AdminModeProvider defaultMode="OFF" storageKey="vite-ui-admin-mode">
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Outlet />
          </ThemeProvider>
        </AdminModeProvider>
      </ConvexAuthProvider>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
