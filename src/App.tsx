"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import SignInForm from "./components/SignInForm";
import SignOutButton from "./components/SignOutButton";
import { api } from "../convex/_generated/api";
import TaskList from "./components/TaskList";
import AdminModeToggle from "./components/AdminModeToggle";
import { ModeToggle as ThemeModeToggle } from "./components/ui/mode-toggle";
import NewTaskButton from "./components/NewTaskButton";

export default function App() {
  const tasks = useQuery(api.tasks.listTasks, {});
  tasks?.sort((a, b) => a.order - b.order);
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800 justify-between flex">
        <h1 className="text-2xl text-center">TrackIt</h1>
        <AdminModeToggle />
        <div className="flex gap-2">
          <SignOutButton />
          <ThemeModeToggle />
        </div>
      </header>
      <main className="p-8 flex flex-col gap-16">
        <Authenticated>
          <div>
            <section className="grid place-content-center">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <TaskList tasks={tasks} level={0} />
              <div className="mt-4">
                <NewTaskButton />
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
