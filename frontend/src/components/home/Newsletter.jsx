function Newsletter() {
  return (
    <section className="py-20 bg-amber-900 text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold">
          Stay Updated!
        </h2>

        <p className="mt-4 text-lg text-amber-100">
          Subscribe to receive exclusive offers and new chocolate launches.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-3 rounded-lg text-gray-800 w-full sm:w-96"
          />

          <button className="bg-white text-amber-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-100 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;