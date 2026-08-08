import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="bg-amber-800 text-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold"
        >
          <span>🍫</span>
          <span>Chocolate Shop</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-amber-200 transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="hover:text-amber-200 transition"
          >
            About
          </Link>

          <Link
            to="/products"
            className="hover:text-amber-200 transition"
          >
            Products
          </Link>

          <a
            href="#contact"
            className="hover:text-amber-200 transition"
          >
            Contact
          </a>

        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-xl">

          <span className="cursor-pointer">
            🔍
          </span>

          <span className="cursor-pointer">
            ❤️
          </span>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative cursor-pointer"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>

          <span className="cursor-pointer">
            👤
          </span>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;