function Categories() {
  const categories = [
    {
      id: 1,
      icon: "🍫",
      title: "Dark Chocolate",
      description: "Rich cocoa with intense flavor.",
    },
    {
      id: 2,
      icon: "🥛",
      title: "Milk Chocolate",
      description: "Smooth and creamy delight.",
    },
    {
      id: 3,
      icon: "🤍",
      title: "White Chocolate",
      description: "Sweet and buttery goodness.",
    },
    {
      id: 4,
      icon: "🎁",
      title: "Gift Boxes",
      description: "Perfect gifts for every occasion.",
    },
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition duration-300"
            >
              <div className="text-6xl mb-4">{category.icon}</div>

              <h3 className="text-xl font-bold text-amber-900">
                {category.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {category.description}
              </p>

              <button className="mt-6 bg-amber-900 text-white px-5 py-2 rounded-lg hover:bg-amber-800 transition">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;