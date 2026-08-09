import React from "react";
import "./WhyChooseUs.css";

const features = [
  {
    id: 1,
    icon: "🍫",
    title: "Handmade with Love",
    description:
      "Every chocolate is carefully handcrafted with passion and attention to detail.",
  },
  {
    id: 2,
    icon: "🌱",
    title: "Premium Ingredients",
    description:
      "We use high-quality ingredients to create rich, delicious and memorable chocolates.",
  },
  {
    id: 3,
    icon: "🎁",
    title: "Perfect for Every Occasion",
    description:
      "Whether it is a birthday, celebration or special gift, our chocolates make every moment sweeter.",
  },
  {
    id: 4,
    icon: "🚚",
    title: "Fresh & Fast Delivery",
    description:
      "We carefully pack every order and deliver your chocolates fresh and ready to enjoy.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section">
      <div className="why-container">

        {/* Heading */}

        <div className="why-heading">

          <span className="why-tag">
            ❤️ Why Choose Us
          </span>

          <h2>
            Made With Passion,
            <br />
            Delivered With Care
          </h2>

          <p>
            We believe great chocolate is more than just
            a sweet treat. It is an experience made with
            quality, passion and care.
          </p>

        </div>


        {/* Features */}

        <div className="why-grid">

          {features.map((feature) => (
            <div
              className="why-card"
              key={feature.id}
            >

              <div className="why-icon">
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;