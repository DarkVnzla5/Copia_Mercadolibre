import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
