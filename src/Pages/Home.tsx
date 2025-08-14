import React from "react";
import Products from "../components/Products";
import Filters from "../components/Filters";

const Home: React.FC = () => {
  return (
    <section className="flex flex-row ">
      <div className="h-full w-1/4 p-4 bg-base-200">
        <Filters />
      </div>
      <div className="h-full w-3/4 p-4 bg-base-100">
        <Products />
      </div>
    </section>
  );
};
export default Home;
