import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import SignInForm from "@/components/SignInForm.tsx";
import SignOutButton from "@/components/SignOutButton.tsx";
import { api } from "../../convex/_generated/api";
import TaskList from "@/components/TaskList";
import AdminModeToggle from "@/components/AdminModeToggle";
import { ModeToggle as ThemeModeToggle } from "@/components/ui/mode-toggle";
import NewTaskButton from "@/components/NewTaskButton";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TEST" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const tasks = useQuery(api.tasks.listTasks, {});
  tasks?.sort((a, b) => a.order - b.order);
  return (
    <>
      <header className="sticky top-0 z-10 bg-slate-900 p-4 border-b-2 border-slate-200 dark:border-slate-800 justify-between flex">
        <h1 className="text-2xl text-center">TrackIt</h1>
        <AdminModeToggle />
        <div className="flex gap-2">
          <SignOutButton />
          <ThemeModeToggle />
        </div>
      </header>
      <main className="p-8 flex flex-col gap-16">
        <Authenticated>
          <div className="w-full max-w-4xl mx-auto">
            <section>
              <h2 className="text-2xl font-bold text-center mb-6">Tasks</h2>
              <div className="w-full space-y-1">
                <TaskList tasks={tasks} level={0} />
                <div className="mt-4 px-4">
                  <NewTaskButton />
                </div>
              </div>
            </section>
          </div>
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
      <footer className="bg-light dark:bg-dark p-4 border-t-2 border-slate-200 dark:border-slate-800">
        <p className="text-center text-xs">
          Made with Convex, React, and Convex Auth
        </p>
      </footer>
    </>
  );
}
