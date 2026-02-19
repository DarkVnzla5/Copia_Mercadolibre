import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Items from "./Pages/Items.tsx";
import Layout from "./components/Layout.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Profile from "./Pages/Profile.tsx";
import About from "./Pages/About.tsx";
import Dashboard from "./Pages/Dashboard.tsx";
import Details from "./Pages/Details.tsx";
import Logistics from "./Pages/Logistics.tsx";
import Pedidos from "./Pages/Pedidos.tsx";
import Cart from "./Pages/Cart.tsx";
import Inventoryentry from "./Pages/Inventoryentry.tsx";
import "./App.css";
import Auths from "./Pages/Auths.tsx";

const App: React.FC = () => {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="error-boundary flex flex-col items-center justify-center bg-base-300 min-h-screen w-screen  text-primary">
          <p>Ups.. Error 404</p>
          <p>{error.message}</p>

          <button
            className="btn-primary text-error bg-base-300 hover:bg-primary-focus"
            onClick={resetErrorBoundary}
          >
            Try again?
          </button>
        </div>
      )}
      onError={(error, info) => {
        console.error("ErrorBoundary caught an error: ", error, info);
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:id" element={<Details />} />
            <Route path="cart" element={<Cart />} />
            <Route path="About" element={<About />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="Auths" element={<Auths />} />
            <Route path="Dashboard" element={<Dashboard />}>
              <Route path="Logistics" element={<Logistics />} />
              <Route path="Inventoryentry" element={<Inventoryentry />} />
              <Route path="Items" element={<Items />} />
              <Route path="Pedidos" element={<Pedidos />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <div className="text-center text-2xl text-error ">
                Error 404: Página no encontrada
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
export default App;
