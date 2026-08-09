import React, { useState } from "react";
import "./Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "Thank you for subscribing! 🍫 You'll receive our latest chocolate updates."
    );

    setEmail("");
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">

        <div className="newsletter-icon">
          🍫
        </div>

        <div className="newsletter-content">
          <span className="newsletter-tag">
            ✨ Stay Connected
          </span>

          <h2>
            Get Sweet Updates
          </h2>

          <p>
            Subscribe to our newsletter for new chocolates,
            special offers and delicious updates.
          </p>

          <form
            className="newsletter-form"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              aria-label="Email address"
            />

            <button type="submit">
              Subscribe
            </button>
          </form>

          {message && (
            <p className="newsletter-message">
              {message}
            </p>
          )}

          <small>
            We respect your privacy. No spam.
          </small>
        </div>

      </div>
    </section>
  );
}

export default Newsletter;