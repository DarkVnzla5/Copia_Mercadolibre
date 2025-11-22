import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface ItemDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  brand: string;
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch("API_URL/products/${id}")
        .then((res) => res.json())
        .then((data: ItemDetails) => {
          setItem(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching item details:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <section>
      <div>
        <p>Items Detail</p>
        <p>{}</p>
        <p></p>
      </div>
    </section>
  );
};

export default Details;
