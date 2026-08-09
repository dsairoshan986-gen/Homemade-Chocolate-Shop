import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    id: 1,
    name: "Priya",
    location: "Chennai",
    rating: 5,
    review:
      "The chocolates were absolutely delicious! The dark chocolate truffles were rich, fresh and beautifully packed.",
  },
  {
    id: 2,
    name: "Rahul",
    location: "Hyderabad",
    rating: 5,
    review:
      "I ordered chocolates for my friend's birthday and everyone loved them. The quality and taste were excellent.",
  },
  {
    id: 3,
    name: "Ananya",
    location: "Bengaluru",
    rating: 5,
    review:
      "Amazing homemade chocolates! They tasted fresh and premium. I will definitely order again.",
  },
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        {/* Heading */}

        <div className="testimonials-heading">

          <span className="testimonials-tag">
            💬 Customer Reviews
          </span>

          <h2>
            What Our Customers Say
          </h2>

          <p>
            Our customers make every chocolate
            moment sweeter.
          </p>

        </div>


        {/* Testimonials */}

        <div className="testimonials-grid">

          {testimonials.map((testimonial) => (
            <div
              className="testimonial-card"
              key={testimonial.id}
            >

              {/* Quote */}

              <div className="testimonial-quote">
                "
              </div>


              {/* Rating */}

              <div className="testimonial-rating">
                {"⭐".repeat(testimonial.rating)}
              </div>


              {/* Review */}

              <p className="testimonial-review">
                {testimonial.review}
              </p>


              {/* Customer */}

              <div className="testimonial-customer">

                <div className="testimonial-avatar">
                  {testimonial.name.charAt(0)}
                </div>

                <div>
                  <h3>
                    {testimonial.name}
                  </h3>

                  <span>
                    {testimonial.location}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;