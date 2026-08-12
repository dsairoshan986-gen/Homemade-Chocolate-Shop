function About() {
  return (
    <main className="min-h-screen bg-[#fff8ef] text-[#632b0e]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-[#fff0df] px-5 py-3 rounded-full mb-6">

            <span>
              🍫
            </span>

            <span className="font-bold">
              About Chocolate Shop
            </span>

          </div>


          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Handmade With Love
          </h1>


          <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#36516d] leading-8">
            We create delicious handmade chocolates using
            premium ingredients, rich flavors and lots of love.
          </p>

        </div>

      </section>


      {/* =================================================
          OUR STORY
      ================================================= */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">


          {/* IMAGE / CHOCOLATE AREA */}

          <div className="bg-[#f4dfc8] rounded-3xl min-h-[400px] flex items-center justify-center shadow-lg">

            <div className="text-center">

              <div className="text-8xl mb-5">
                🍫
              </div>

              <h2 className="text-3xl font-extrabold">
                Made With Love
              </h2>

            </div>

          </div>


          {/* STORY */}

          <div>

            <p className="text-[#c65300] font-bold uppercase tracking-wide mb-3">
              Our Story
            </p>

            <h2 className="text-4xl font-extrabold mb-6">
              A Little Chocolate,
              A Lot of Happiness
            </h2>

            <p className="text-[#36516d] leading-8 mb-5">
              Chocolate Shop was created with one simple idea:
              to make delicious chocolates that bring happiness
              to every occasion.
            </p>

            <p className="text-[#36516d] leading-8 mb-5">
              Every chocolate is carefully prepared using
              quality ingredients and attention to detail.
              From classic favorites to special creations,
              we put care into everything we make.
            </p>

            <p className="text-[#36516d] leading-8">
              Whether you are treating yourself, celebrating
              a special occasion or sharing something sweet
              with someone you love, our chocolates are made
              to make every moment a little more special.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          VALUES
      ================================================= */}

      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">

            <p className="text-[#c65300] font-bold uppercase tracking-wide mb-3">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-extrabold">
              Made For Chocolate Lovers
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


            {/* CARD 1 */}

            <div className="bg-[#fff8ef] rounded-2xl p-8 text-center shadow-sm">

              <div className="text-5xl mb-5">
                ❤️
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Made With Love
              </h3>

              <p className="text-[#36516d] leading-7">
                Every chocolate is carefully prepared with
                passion and attention to detail.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="bg-[#fff8ef] rounded-2xl p-8 text-center shadow-sm">

              <div className="text-5xl mb-5">
                ⭐
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Premium Quality
              </h3>

              <p className="text-[#36516d] leading-7">
                We use quality ingredients to create rich,
                delicious and satisfying chocolates.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="bg-[#fff8ef] rounded-2xl p-8 text-center shadow-sm">

              <div className="text-5xl mb-5">
                🍫
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Fresh Chocolates
              </h3>

              <p className="text-[#36516d] leading-7">
                Our chocolates are prepared with care so
                every bite tastes fresh and delicious.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          CONTACT CTA
      ================================================= */}

      <section className="max-w-5xl mx-auto px-6 py-20">

        <div className="bg-[#6b2e0b] text-white rounded-3xl p-10 md:p-14 text-center">

          <h2 className="text-4xl font-extrabold mb-5">
            Have Questions?
          </h2>

          <p className="text-[#f5d8c6] text-lg mb-8">
            We would love to hear from you.
          </p>

          <a
            href="/contact-support"
            className="
              inline-block
              bg-[#c65300]
              text-white
              px-8
              py-4
              rounded-xl
              font-bold
              no-underline
              hover:bg-[#a84300]
              transition
            "
          >
            Contact Us
          </a>

        </div>

      </section>

    </main>
  );
}

export default About;