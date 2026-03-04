import { Outlet } from "react-router";
import Bars from "../components/Bars";

function Dashboard() {
  return (
    <div>
      <aside>
        <Bars />
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;
