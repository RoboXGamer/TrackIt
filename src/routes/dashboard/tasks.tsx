import { Route } from "./+types/tasks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrackIt - Dashboard" },
    { name: "description", content: "Welcome to TrackIt!" },
  ];
}

import { Tasks } from "@/components";

export default function Dashboard() {
  return (
    <>
      <Tasks />
    </>
  );
}
