import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffaf0]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 text-white">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white" />
          <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">

          <p className="uppercase tracking-[0.3em] text-amber-200 text-sm font-semibold mb-5">
            Welcome to our chocolate world
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Made With Love,
            <br />
            Crafted With Chocolate
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-amber-100 leading-relaxed">
            Discover delicious homemade chocolates created
            with care, quality ingredients, and a passion
            for making every moment a little sweeter.
          </p>

        </div>

      </section>

      {/* =====================================================
          OUR STORY
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* Chocolate Illustration */}

          <div className="relative">

            <div className="bg-gradient-to-br from-amber-900 to-amber-700 rounded-[2rem] p-10 shadow-2xl">

              <div className="bg-[#fffaf0] rounded-3xl p-10 text-center">

                <div className="text-8xl mb-6">
                  🍫
                </div>

                <h3 className="text-2xl font-bold text-amber-900">
                  Handmade Happiness
                </h3>

                <p className="mt-3 text-gray-600">
                  Every chocolate is prepared with
                  attention to detail.
                </p>

              </div>

            </div>

          </div>

          {/* Story */}

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-amber-700 font-bold mb-3">
              Our Story
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-amber-950 mb-6">
              A Little Bit of Chocolate,
              <br />
              A Lot of Love
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              Our homemade chocolate journey started with
              a simple idea — create chocolates that feel
              personal, delicious, and made with genuine care.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              Instead of mass-produced treats, we focus on
              carefully prepared chocolates that bring the
              warmth of homemade goodness to every customer.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              From rich dark chocolate to creamy milk
              chocolate and delightful Ferrero-inspired
              treats, every product is created to make your
              chocolate experience special.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <p className="text-sm uppercase tracking-[0.25em] text-amber-700 font-bold mb-3">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-bold text-amber-950">
              What Makes Our Chocolates Special?
            </h2>

            <p className="max-w-2xl mx-auto mt-4 text-gray-600 text-lg">
              We believe great chocolate is about more than
              just taste. It is about quality, care, and the
              experience behind every bite.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">

            {/* Card 1 */}

            <div className="rounded-3xl bg-[#fffaf0] p-8 text-center shadow-md hover:shadow-xl transition">

              <div className="text-5xl mb-5">
                🏠
              </div>

              <h3 className="text-xl font-bold text-amber-950 mb-3">
                Homemade
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Prepared with the care and attention you
                expect from homemade chocolates.
              </p>

            </div>

            {/* Card 2 */}

            <div className="rounded-3xl bg-[#fffaf0] p-8 text-center shadow-md hover:shadow-xl transition">

              <div className="text-5xl mb-5">
                🌱
              </div>

              <h3 className="text-xl font-bold text-amber-950 mb-3">
                Quality Ingredients
              </h3>

              <p className="text-gray-600 leading-relaxed">
                We focus on quality ingredients to create
                chocolates with delicious flavor and texture.
              </p>

            </div>

            {/* Card 3 */}

            <div className="rounded-3xl bg-[#fffaf0] p-8 text-center shadow-md hover:shadow-xl transition">

              <div className="text-5xl mb-5">
                ❤️
              </div>

              <h3 className="text-xl font-bold text-amber-950 mb-3">
                Made With Care
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Every product receives attention to detail
                from preparation to packaging.
              </p>

            </div>

            {/* Card 4 */}

            <div className="rounded-3xl bg-[#fffaf0] p-8 text-center shadow-md hover:shadow-xl transition">

              <div className="text-5xl mb-5">
                ✨
              </div>

              <h3 className="text-xl font-bold text-amber-950 mb-3">
                Sweet Experience
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Our goal is to make every order feel special,
                memorable, and delicious.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          OUR VALUES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">

          <p className="text-sm uppercase tracking-[0.25em] text-amber-700 font-bold mb-3">
            Our Values
          </p>

          <h2 className="text-4xl font-bold text-amber-950">
            What We Believe In
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="border border-amber-100 rounded-3xl p-8 bg-white shadow-sm">

            <div className="text-4xl mb-5">
              🤎
            </div>

            <h3 className="text-2xl font-bold text-amber-950 mb-3">
              Quality
            </h3>

            <p className="text-gray-600 leading-relaxed">
              We aim to deliver chocolates that meet a
              high standard of taste, freshness, and
              presentation.
            </p>

          </div>

          <div className="border border-amber-100 rounded-3xl p-8 bg-white shadow-sm">

            <div className="text-4xl mb-5">
              👩‍🍳
            </div>

            <h3 className="text-2xl font-bold text-amber-950 mb-3">
              Craftsmanship
            </h3>

            <p className="text-gray-600 leading-relaxed">
              We treat chocolate making as a craft,
              paying attention to the details that make
              each product enjoyable.
            </p>

          </div>

          <div className="border border-amber-100 rounded-3xl p-8 bg-white shadow-sm">

            <div className="text-4xl mb-5">
              😊
            </div>

            <h3 className="text-2xl font-bold text-amber-950 mb-3">
              Customer Happiness
            </h3>

            <p className="text-gray-600 leading-relaxed">
              We want every customer to enjoy not only
              our chocolates but also the experience of
              ordering from us.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          CALL TO ACTION
      ===================================================== */}

      <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <div className="text-6xl mb-6">
            🍫
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            Ready for Something Sweet?
          </h2>

          <p className="text-amber-100 text-lg max-w-2xl mx-auto mb-8">
            Explore our collection of homemade chocolates
            and find your next favorite treat.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-white text-amber-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 transition shadow-lg"
          >
            Explore Our Chocolates
          </button>

        </div>

      </section>

    </div>
  );
}

export default About;