import React from "react";

// Home page components
import Hero from "../../components/home/Hero";
import Categories from "../../components/home/Categories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Testimonials from "../../components/home/Testimonials";
import Newsletter from "../../components/home/Newsletter";

function Home() {
  return (
    <main className="home-page">

      {/* =========================================
          HERO SECTION
          ========================================= */}

      <Hero />


      {/* =========================================
          CATEGORIES SECTION
          ========================================= */}

      <Categories />


      {/* =========================================
          FEATURED PRODUCTS SECTION
          ========================================= */}

      <FeaturedProducts />


      {/* =========================================
          WHY CHOOSE US SECTION
          ========================================= */}

      <WhyChooseUs />


      {/* =========================================
          TESTIMONIALS SECTION
          ========================================= */}

      <Testimonials />


      {/* =========================================
          NEWSLETTER SECTION
          ========================================= */}

      <Newsletter />

    </main>
  );
}

export default Home;