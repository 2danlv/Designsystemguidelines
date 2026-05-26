import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { CmsRoute } from "./components/CmsRoute";
import { Layout } from "./components/Layout";

const catchAllRoutes = [
  { index: true, Component: CmsRoute },
  { path: "*", Component: CmsRoute },
];

function MissingLanguageRedirect() {
  const location = useLocation();

  return <Navigate to={`/${location.search}${location.hash}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: catchAllRoutes,
  },
  {
    path: "/en",
    Component: Layout,
    children: catchAllRoutes,
  },
  {
    path: "*",
    Component: MissingLanguageRedirect,
  },
]);
