import { Header, Filters, Footer } from "../components/Header";
import { products } from "../mocks/products";
import React from "react";

function Details(products) {
  return (
    <aside>
      <section>
        <Header />
        <Filters />
      </section>
      <section>
        <div className="container">
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4" key={product.id}>
                <div className="card mb-4">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">${product.price}</p>
                    <a
                      href={`/details/${product.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </aside>
  );
}

export default Details;
