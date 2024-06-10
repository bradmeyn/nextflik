import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../lib/components/layout/Header";
import Footer from "../lib/components/layout/Footer";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});
