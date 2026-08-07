import darkTruffle from "../../assets/images/products/dark-truffle.jpg";
import milkChocolate from "../../assets/images/products/milk-chocolate.jpg";
import whiteChocolate from "../../assets/images/products/white-chocolate.jpg";
import ferrero from "../../assets/images/products/ferrero.jpg";

function ProductCard({ product }) {
  const imageMap = {
    "Dark Chocolate Truffles": darkTruffle,
    "Milk Chocolate": milkChocolate,
    "White Chocolate": whiteChocolate,
    "Ferrero": ferrero,
  };

  const image = imageMap[product.name] || darkTruffle;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
      <img
        src={image}
        alt={product.name}
        className="w-full h-52 object-cover rounded-lg"
      />

      <h3 className="text-2xl font-bold mt-4 text-amber-900">
        {product.name}
      </h3>

      <p className="text-gray-600 mt-2">
        {product.description}
      </p>

      <p className="text-xl font-bold text-red-600 mt-4">
        ₹ {product.price}
      </p>

      <button className="mt-4 w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;