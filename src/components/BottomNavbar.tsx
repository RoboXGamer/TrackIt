import { NavLink as Link, useLocation } from "react-router";
import { Grid3X3, Menu, BarChart3, Swords } from "lucide-react";

export default function BottomNavbar() {
  const location = useLocation();

  // Helper to check if the current path matches or starts with a route
  const isActive = (path: string | string[]) => {
    if (Array.isArray(path)) {
      return path.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center space-y-1 transition-colors ${
            isActive("/dashboard") &&
            !isActive([
              "/dashboard/flashcards",
              "/dashboard/battle",
              "/dashboard/stats",
              "/dashboard/war",
              "/dashboard/attack",
            ])
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Grid3X3 className="w-6 h-6" />
        </Link>
        <Link
          to="/dashboard/flashcards"
          className={`flex flex-col items-center space-y-1 transition-colors ${
            isActive("/dashboard/flashcards")
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Menu className="w-6 h-6" />
        </Link>
        <Link
          to="/dashboard/battle"
          className={`flex flex-col items-center space-y-1 transition-colors ${
            isActive("/dashboard/battle") ||
            isActive("/dashboard/war") ||
            isActive("/dashboard/attack")
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Swords className="w-6 h-6" />
        </Link>
        <Link
          to="/dashboard/stats"
          className={`flex flex-col items-center space-y-1 transition-colors ${
            isActive("/dashboard/stats")
              ? "text-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
