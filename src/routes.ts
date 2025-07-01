import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard/index.tsx", [
    index("routes/dashboard/tasks.tsx"),
    route("flashcards", "routes/dashboard/flashcards.tsx", [
      index("routes/dashboard/flashcards/setup.tsx"),
      route("organize", "routes/dashboard/flashcards/organize.tsx"),
      route("practice", "routes/dashboard/flashcards/practice.tsx"),
      route("review", "routes/dashboard/flashcards/review.tsx"),
    ]),
    // route("battlefield", "routes/battlefield.tsx"),
    // route("stats", "routes/stats.tsx"),
  ]),
  route("tasks/:id", "routes/taskDetails.tsx"),
] satisfies RouteConfig;
