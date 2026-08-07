import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-amber-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          🍫 Chocolate Shop
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 font-medium">

          <li>
            <Link
              to="/"
              className="hover:text-amber-300 transition"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="hover:text-amber-300 transition"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/products"
              className="hover:text-amber-300 transition"
            >
              Products
            </Link>
          </li>

          <li className="cursor-pointer hover:text-amber-300 transition">
            Contact
          </li>

        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5 text-xl">

          <FaSearch className="cursor-pointer hover:text-amber-300 transition" />

          <FaHeart className="cursor-pointer hover:text-amber-300 transition" />

          <FaShoppingCart className="cursor-pointer hover:text-amber-300 transition" />

          <FaUser className="cursor-pointer hover:text-amber-300 transition" />

        </div>
      </div>
    </nav>
  );
}

export default Navbar;