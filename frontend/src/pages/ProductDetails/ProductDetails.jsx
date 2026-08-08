import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

const imageMap = {
  "Dark Chocolate Truffles": darkTruffle,
  "Milk Chocolate": milkChocolate,
  "White Chocolate": whiteChocolate,
  "Ferrero Chocolate": ferrero,
};

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const result = await response.json();

        if (result.success) {
          setProduct(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-amber-900">
          Loading product...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl text-red-600">
          Product not found
        </h2>
      </div>
    );
  }

  const image = imageMap[product.name] || darkTruffle;

  return (
    <section className="min-h-screen bg-[#fffaf0] py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <img
            src={image}
            alt={product.name}
            className="w-full h-[450px] object-cover rounded-2xl shadow-xl"
          />
        </div>

        <div>
          <p className="text-amber-700 font-semibold uppercase tracking-wide">
            Premium Handmade Chocolate
          </p>

          <h1 className="text-5xl font-bold text-amber-900 mt-3">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg mt-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-4xl font-bold text-red-600 mt-6">
            ₹ {product.price}
          </p>

          <p className="text-gray-700 mt-4">
            Stock available:{" "}
            <span className="font-bold">
              {product.stock}
            </span>
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 text-xl"
            >
              -
            </button>

            <span className="text-xl font-bold">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.stock, q + 1)
                )
              }
              className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 text-xl"
            >
              +
            </button>
          </div>

          <button className="mt-8 w-full bg-amber-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-amber-800 transition">
            Add to Cart
          </button>
        </div>

      </div>
    </section>
  );
}

export default ProductDetails;