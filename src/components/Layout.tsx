import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full flex-wrap overflow-hidden">
      <Header />
      <main>
        <div className="container flex gap-2 justify-around items-start mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default Layout;
