import { Outlet } from "react-router";
import Header from "./NavBar";
import Footer from "./Footer";

function Layout() {
  return (
    <section >
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </section>

  );
};
export default Layout;
