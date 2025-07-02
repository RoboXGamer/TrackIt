import { Outlet } from "react-router";
import { Header, Footer, BottomNavbar, SignInForm } from "@/components";
import { Authenticated, Unauthenticated } from "convex/react";
export default function index() {
  return (
    <>
      <Header />
      <main className="grid">
        <Authenticated>
          <Outlet />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
      <Footer />
      <BottomNavbar />
    </>
  );
}
