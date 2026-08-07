function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Dark Chocolate",
      price: "₹299",
      image: "🍫",
    },
    {
      id: 2,
      name: "Milk Chocolate",
      price: "₹249",
      image: "🍬",
    },
    {
      id: 3,
      name: "Chocolate Truffle",
      price: "₹399",
      image: "🍩",
    },
    {
      id: 4,
      name: "Gift Box",
      price: "₹599",
      image: "🎁",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
          Featured Chocolates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-amber-50 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition duration-300"
            >
              <div className="text-6xl mb-4">
                {product.image}
              </div>

              <h3 className="text-xl font-bold text-amber-900">
                {product.name}
              </h3>

              <p className="text-lg text-gray-600 mt-2">
                {product.price}
              </p>

              <p className="text-yellow-500 text-xl mt-2">
                ⭐⭐⭐⭐⭐
              </p>

              <button className="mt-5 bg-amber-900 text-white px-5 py-2 rounded-lg hover:bg-amber-800 transition">
                Add to Cart
              </button>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;