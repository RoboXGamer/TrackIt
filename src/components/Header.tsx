import { ModeToggle as ThemeModeToggle } from "@/components/ui/mode-toggle";
import { AdminModeToggle, SignOutButton } from "@/components";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-slate-900 p-4 border-b-2 border-slate-200 dark:border-slate-800 justify-between flex">
      <h1 className="text-2xl text-center">TrackIt</h1>
      <AdminModeToggle />
      <div className="flex gap-2">
        <SignOutButton />
        <ThemeModeToggle />
      </div>
    </header>
  );
}
