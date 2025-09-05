import React, { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { LoadingSpinner } from "@/shared/components/common/LoadingStates";
import ScrollToTop from "@/shared/components/optimization/ScrollToTop";
import ScrollToHashElement from "@/shared/components/optimization/ScrollToHash";
import { DocsLayout } from "@/modules/docs/layout/DocsLayout";

const lazy = (el: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner />}>{el}</Suspense>
);

const LandingPage    = React.lazy(() => import("@/modules/landing/pages/Index"));
// const PingalaPage    = React.lazy(() => import("@/modules/pingala/pages/PingalaPage"));
// const RealtimeModule = React.lazy(() => import("@/modules/realtime"));
// const AuthModule     = React.lazy(() => import("@/modules/auth"));
// const DashboardModule= React.lazy(() => import("@/modules/dashboard"));
// const LegalModule    = React.lazy(() => import("@/modules/legal/index.tsx"));
// const PricingPage    = React.lazy(() => import("@/modules/pricing/pages/Index"));
// const AboutUs        = React.lazy(() => import("@/modules/aboutUs/pages/Index"));
// const ProductsModule = React.lazy(() => import("@/modules/products/Index"));
// const BookDemo       = React.lazy(() => import("@/modules/contact/pages/BookDemo"));
// const EarlyAccess    = React.lazy(() => import("@/modules/earlyAccess/pages/EarlyAccess"));
// const LicensePage    = React.lazy(() => import("@/pages/License"));
// const DocsModule     = React.lazy(() => import("@/modules/docs"));
// const PingalaV1API   = React.lazy(() => import("@/modules/docs/pages/PingalaV1API"));
// const PRNewsModule   = React.lazy(() => import("@/modules/prNews"));

export const routes: RouteObject[] = [
  { path: "/",            element: lazy(<LandingPage />) },
  // { path: "/pingala",     element: lazy(<PingalaPage />) },
  // { path: "/docs/*",      element: lazy(<DocsModule />) },
  // { path: "/api/*",       element: lazy(<DocsLayout><PingalaV1API /></DocsLayout>) },
  // { path: "/realtime/*",  element: lazy(<RealtimeModule />) },
  // { path: "/auth/*",      element: lazy(<AuthModule />) },
  // { path: "/dashboard/*", element: lazy(<DashboardModule />) },
  // { path: "/legal/*",     element: lazy(<LegalModule />) },
  // { path: "/license",     element: lazy(<LicensePage />) },
  // { path: "/pricing",     element: lazy(<PricingPage />) },
  // { path: "/about",       element: lazy(<AboutUs />) },
  // { path: "/product/*",   element: lazy(<ProductsModule />) },
  // { path: "/contact",     element: lazy(<BookDemo />) },
  // { path: "/early-access",element: lazy(<EarlyAccess />) },
  // { path: "/pr-news/*",   element: lazy(<PRNewsModule />) },
];

export function ScrollHelpers() {
  return (
    <>
      <ScrollToTop />
      <ScrollToHashElement />
    </>
  );
}
