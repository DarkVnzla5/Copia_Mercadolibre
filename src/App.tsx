import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route } from "react-router";
import Items from "./Pages/Items.tsx";
import Layout from "./components/Layout.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Profile from "./Pages/Profile.tsx";
import About from "./Pages/About.tsx";

import "./App.css";

function App() {
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
            <Route path="/Items" element={<Items />} />
            <Route path="/About" element={<About />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="text-center text-2xl text-red-500">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
export default App;
