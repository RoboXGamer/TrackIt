import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("tasks/:id", "routes/taskDetails.tsx"),
] satisfies RouteConfig;
