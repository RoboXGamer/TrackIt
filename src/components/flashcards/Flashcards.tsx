import { Outlet } from "react-router";

export default function Flashcards() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <section>
        <div className="w-full space-y-1">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
