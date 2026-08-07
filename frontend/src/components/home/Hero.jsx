function Hero() {
  return (
    <section className="bg-amber-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <p className="text-amber-700 font-semibold uppercase tracking-widest mb-3">
            Premium Handmade Chocolates
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 leading-tight">
            Crafted with Love,
            <br />
            Wrapped in Happiness
          </h1>

          <p className="mt-6 text-lg text-gray-700 leading-8">
            Experience rich, handcrafted chocolates made from premium
            ingredients. Every bite is carefully created to bring joy,
            sweetness, and unforgettable memories.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition">
              Shop Now
            </button>

            <button className="border-2 border-amber-900 text-amber-900 px-6 py-3 rounded-lg hover:bg-amber-900 hover:text-white transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex justify-center">
          <div className="w-80 h-80 rounded-full bg-amber-200 flex items-center justify-center text-8xl shadow-xl">
            🍫
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;