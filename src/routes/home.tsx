import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrackIt" },
    { name: "description", content: "Welcome to TrackIt!" },
  ];
}

export default function Home() {
  return <div>home</div>;
}
