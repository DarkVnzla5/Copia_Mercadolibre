import React from "react";
import Products from "../components/Products";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full flex-wrap overflow-hidden">
      <Products />
    </div>
  );
};
export default Home;
