function WhyChooseUs() {
  const features = [
    {
      id: 1,
      icon: "🌱",
      title: "Fresh Ingredients",
      description: "We use only premium quality natural ingredients.",
    },
    {
      id: 2,
      icon: "❤️",
      title: "Handmade with Love",
      description: "Every chocolate is handcrafted with care.",
    },
    {
      id: 3,
      icon: "🚚",
      title: "Fast Delivery",
      description: "Fresh chocolates delivered quickly to your doorstep.",
    },
    {
      id: 4,
      icon: "⭐",
      title: "Premium Quality",
      description: "Rich taste with exceptional quality in every bite.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-amber-50 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition duration-300"
            >
              <div className="text-6xl mb-4">{feature.icon}</div>

              <h3 className="text-xl font-bold text-amber-900">
                {feature.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;