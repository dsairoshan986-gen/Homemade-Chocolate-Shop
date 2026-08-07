import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center text-amber-900 mb-10">
        Featured Chocolates
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;