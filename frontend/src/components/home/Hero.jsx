import { useNavigate } from "react-router-dom";
import darkTruffle from "../../assets/images/products/dark-truffle.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#fff5e8] min-h-[calc(100vh-80px)]">

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#f5dfc8] opacity-40" />

        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#f1dcc5] opacity-30" />

      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[650px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="max-w-2xl">

            {/* Small badge */}

            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-sm mb-8">

              <span className="text-xl">
                🍫
              </span>

              <span className="font-semibold text-amber-800">
                Handmade With Love
              </span>

            </div>

            {/* Main heading */}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#6b2e0b]">

              Delicious
              <br />

              Chocolate,
              <br />

              Made Just For
              <br />

              You

            </h1>

            {/* Description */}

            <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-gray-700">

              Discover handcrafted chocolates made with
              premium ingredients, rich flavors, and lots
              of love.

            </p>

            {/* Buttons */}

            <div className="flex flex-wrap gap-4 mt-9">

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="px-8 py-4 rounded-xl bg-[#b84d00] text-white font-bold text-lg shadow-md hover:bg-[#963f00] hover:shadow-lg transition-all duration-200"
              >
                Shop Chocolates
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/about")
                }
                className="px-8 py-4 rounded-xl bg-white text-[#8a3d0c] font-bold text-lg border border-[#d9b99a] hover:bg-[#fffaf4] transition-all duration-200"
              >
                Our Story
              </button>

            </div>

            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="flex flex-wrap gap-10 mt-12">

              <div>
                <p className="text-lg font-bold text-[#71320c]">
                  100%
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Homemade
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-[#71320c]">
                  Premium
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Ingredients
                </p>
              </div>

              <div>
                <p className="text-lg font-bold text-[#71320c]">
                  Fresh
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Every Day
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="relative flex items-center justify-center min-h-[500px]">

            {/* Outer circle */}

            <div className="absolute w-[390px] h-[390px] sm:w-[470px] sm:h-[470px] lg:w-[500px] lg:h-[500px] rounded-full border-[10px] border-[#ead2b8] shadow-sm" />

            {/* Inner circle */}

            <div className="relative w-[350px] h-[350px] sm:w-[430px] sm:h-[430px] lg:w-[460px] lg:h-[460px] rounded-full overflow-hidden border-[8px] border-white shadow-2xl">

              <img
                src={darkTruffle}
                alt="Homemade dark chocolate truffles"
                className="w-full h-full object-cover"
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            </div>

            {/* =================================================
                FLOATING CARD
            ================================================= */}

            <div className="absolute bottom-4 right-0 sm:right-2 lg:right-0 bg-white rounded-2xl shadow-xl px-6 py-5 flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
                ⭐
              </div>

              <div>

                <p className="font-bold text-gray-900">
                  Made With Love
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Premium Homemade Chocolate
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;