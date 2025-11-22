import React from "react";
import { NavLink } from "react-router";

const Sidebar: React.FC = () => {
  return (
    <ul className="menu bg-base-200 w-56 min-h-full p-4 text-base-content">
      {/* Sidebar content */}
      <li>
        <NavLink to="/">Dashboard</NavLink>
      </li>
      <li>
        <NavLink to="/sales">Ventas</NavLink>
      </li>
      <li>
        <NavLink to="/reports">Reportes</NavLink>
      </li>
    </ul>
  );
};

export default Sidebar;
