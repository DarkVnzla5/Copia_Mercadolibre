import React from "react";
import { Outlet } from "react-router";
import Bars from "../components/Bars";

const Dashboard: React.FC = () => {
  return (
    <section className="p-8 bg-base-200 min-h-screen">
      <section>
        <Bars />
      </section>
      <section>
        <Outlet />
      </section>
    </section>
  );
};

export default Dashboard;
