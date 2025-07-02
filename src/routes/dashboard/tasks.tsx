import { Route } from "./+types/tasks";
import { Tasks } from "@/components";
import { useProject } from "@/components/providers/ProjectProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrackIt - Dashboard" },
    { name: "description", content: "Welcome to TrackIt!" },
  ];
}

export default function Dashboard() {
  return <Tasks />;
}
