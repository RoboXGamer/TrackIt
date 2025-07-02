import { Outlet } from "react-router";

export default function Flashcards() {
  return (
    <div className="w-full mx-auto p-4">
      <section>
        <div className="w-full space-y-1">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
