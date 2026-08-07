function Footer() {
  return (
    <footer className="bg-amber-950 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            🍫 Chocolate Shop
          </h2>

          <p className="text-amber-200">
            Premium handmade chocolates crafted with love and the finest ingredients.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-amber-200">
            <li>Home</li>
            <li>About</li>
            <li>Products</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">
            Contact
          </h3>

          <p className="text-amber-200">
            📍 Hyderabad, India
          </p>

          <p className="text-amber-200">
            📞 +91 98765 43210
          </p>

          <p className="text-amber-200">
            ✉️ info@chocolateshop.com
          </p>
        </div>

      </div>

      <div className="text-center mt-10 text-amber-300">
        © 2026 Homemade Chocolate Shop. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;