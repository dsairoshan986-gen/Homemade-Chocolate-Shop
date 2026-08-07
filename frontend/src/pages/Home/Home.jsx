import Hero from "../../components/home/Hero";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Categories from "../../components/home/Categories";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Testimonials from "../../components/home/Testimonials";
import Newsletter from "../../components/home/Newsletter";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;