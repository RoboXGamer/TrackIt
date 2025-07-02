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
    route("battle", "routes/dashboard/battlefield/index.tsx"),
    route("war", "routes/dashboard/battlefield/war/index.tsx", [
      index("components/battlefield/war/WarMode.tsx"),
      route("config", "routes/dashboard/battlefield/war/config.tsx"),
      route("battle", "components/battlefield/war/BeginBattle.tsx"),
      route(
        "report-card",
        "components/battlefield/war/pages/PTSReportCard.tsx",
      ),
      route("dashboard", "components/battlefield/war/pages/WarReportIndex.tsx"),
    ]),
    route("attack", "routes/dashboard/battlefield/attack/index.tsx", [
      index("components/battlefield/attack/AttackWelcome.tsx"),
      route("mental", "components/battlefield/attack/MentalTimer.tsx"),
      route("plan", "components/battlefield/attack/AttackPlan.tsx"),
      route("battle", "components/battlefield/attack/BeastBattle.tsx"),
      route("reflect", "components/battlefield/attack/BattleReflection.tsx"),
      route(
        "analytics",
        "components/battlefield/attack/AnalyticsDashboard.tsx",
      ),
      route("streaks", "components/battlefield/attack/StreakTracker.tsx"),
    ]),
    // route("stats", "routes/stats.tsx"),
  ]),
  route("tasks/:id", "routes/taskDetails.tsx"),
] satisfies RouteConfig;
