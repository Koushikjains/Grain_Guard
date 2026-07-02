import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import appCss from "../styles.css?url";
import { AppProvider } from "@/lib/app-context";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GrainGuard — Smart Grain Storage Platform" },
      {
        name: "description",
        content:
          "GrainGuard connects farmers with verified storage owners using secure escrow payments, AI-driven matching, and market insights.",
      },
      { name: "author", content: "GrainGuard" },
      { name: "theme-color", content: "#9CAF88" },
      { property: "og:title", content: "GrainGuard — Smart Grain Storage Platform" },
      {
        property: "og:description",
        content:
          "Secure escrow-based grain storage marketplace for farmers and storage owners across India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "GrainGuard" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GrainGuard — Smart Grain Storage" },
      {
        name: "twitter:description",
        content: "Find trusted storage. Pay safely with escrow. Track crops in real time.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </QueryClientProvider>
  );
}
