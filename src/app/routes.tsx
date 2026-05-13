import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Members } from "./pages/Members";
import { Culture } from "./pages/Culture";
import { Services } from "./pages/Services";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { News } from "./pages/News";
import { NewsDetail } from "./pages/NewsDetail";
import { Jobs } from "./pages/Jobs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/vi/" replace />
  },
  {
    path: "/vi",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "gioi-thieu-tona", Component: About },
      { path: "doi-ngu", Component: Members },
      { path: "cuoc-song-tona", Component: Culture },
      { path: "dich-vu", Component: Services },
      { path: "du-an-tona", Component: Projects },
      { path: "project/:slug", Component: ProjectDetail },
      { path: "news", Component: News },
      { path: "news/:slug", Component: NewsDetail },
      { path: "nghe-nghiep", Component: Jobs },
    ],
  },
]);
