import { Outlet } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const WarMode = () => {
  const battleState = useQuery(api.battle.getBattleState);

  // Optionally, you can add logic here to redirect based on battleState.phase
  // For example, if phase is 'completed', navigate to '/dashboard/war/report-card'
  // This would handle direct access to /dashboard/war when a battle is already in a specific phase.

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 via-slate-900 to-black">
      {/* War-themed background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-slate-900/20"></div>
      </div>

      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default WarMode;
