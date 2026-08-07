function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Priya",
      review: "The chocolates were absolutely delicious and beautifully packed!",
    },
    {
      id: 2,
      name: "Rahul",
      review: "Perfect for gifting. My family loved every bite!",
    },
    {
      id: 3,
      name: "Sneha",
      review: "Fresh, premium quality, and amazing customer service.",
    },
  ];

  return (
    <section className="py-20 bg-amber-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="text-yellow-500 text-xl mb-4">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-700 italic">
                "{review.review}"
              </p>

              <h3 className="mt-6 text-lg font-bold text-amber-900">
                — {review.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;