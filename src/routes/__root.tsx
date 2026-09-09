import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { ECommerceProvider } from "../lib/ecommerce-context";
import { SiteLayout } from "../components/site/SiteLayout";
import { CartDrawer } from "../components/ecommerce/CartDrawer";
import { QuickViewModal } from "../components/ecommerce/QuickViewModal";
import { SearchModal } from "../components/ecommerce/SearchModal";
import { ConsultationBookingModal } from "../components/ecommerce/ConsultationBookingModal";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" style={{ minHeight: "60vh", textAlign: "center", padding: "80px 20px" }}>
      <div className="max-w-md text-center">
        <h1 style={{ fontSize: "6rem", background: "linear-gradient(135deg, #0F3822, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>404</h1>
        <h2 style={{ fontFamily: "Playfair Display, serif" }}>Page Not Found</h2>
        <p className="muted" style={{ margin: "12px 0 24px" }}>
          The page you are looking for does not exist or has been relocated.
        </p>
        <div>
          <Link to="/" className="btn btn-primary btn-lg">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" style={{ minHeight: "60vh", textAlign: "center", padding: "80px 20px" }}>
      <div className="max-w-md text-center">
        <h2 style={{ fontFamily: "Playfair Display, serif" }}>Something Went Wrong</h2>
        <p className="muted" style={{ margin: "12px 0 24px" }}>
          We encountered an unexpected error while loading this page. Please try refreshing or return home.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <a href="/" className="btn btn-outline">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Kiana Naturopathy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ECommerceProvider>
          <SiteLayout>
            <Outlet />
          </SiteLayout>
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
          <ConsultationBookingModal />
        </ECommerceProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

