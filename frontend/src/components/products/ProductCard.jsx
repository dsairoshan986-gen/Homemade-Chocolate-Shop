import { Link } from "react-router-dom";

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

function ProductCard({ product }) {
  const image = imageMap[product.name] || darkTruffle;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <Link to={`/products/${product.id}`}>
        <img
          src={image}
          alt={product.name}
          className="w-full h-52 object-cover cursor-pointer"
        />
      </Link>

      <div className="p-5">

        <Link to={`/products/${product.id}`}>
          <h3 className="text-2xl font-bold text-amber-900 hover:text-amber-700 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 mt-2">
          {product.description}
        </p>

        <p className="text-xl font-bold text-red-600 mt-4">
          ₹ {product.price}
        </p>

        <button className="mt-4 w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition">
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;