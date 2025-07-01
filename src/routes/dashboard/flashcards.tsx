import { Flashcards } from "@/components";
import { Route } from "./+types/flashcards";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrackIt - Dashboard | Flashcards" },
    { name: "description", content: "Welcome to TrackIt!" },
  ];
}

export default function flashcards() {
  return <Flashcards />;
}
