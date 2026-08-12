import { useState } from "react";
import { Link } from "react-router-dom";

function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };

  // =====================================================
  // HANDLE FORM SUBMIT
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const {
      name,
      email,
      subject,
      message,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !subject ||
      !message.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // ---------------------------------------------------
    // OPEN USER'S EMAIL APPLICATION
    // ---------------------------------------------------

    const mailSubject = encodeURIComponent(
      `Chocolate Shop Support: ${subject}`
    );

    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:d.sairoshan986@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#fff8ef]">

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="bg-[#fff1df] px-6 py-16">

        <div className="max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm">

            <span className="text-xl">
              💬
            </span>

            <span className="font-semibold text-[#8a3d0c]">
              We're Here to Help
            </span>

          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-[#6b2e0b]">
            Contact Support
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-lg text-gray-600 leading-relaxed">
            Have a question about our chocolates,
            orders, delivery, or anything else?
            Our support team is happy to help.
          </p>

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="px-6 py-16">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <div>

            <h2 className="text-3xl font-bold text-[#6b2e0b]">
              Get in Touch
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              We're always happy to hear from our
              customers. Contact us using any of the
              options below.
            </p>


            {/* =================================================
                EMAIL SUPPORT
            ================================================= */}

            <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-[#f0dfce]">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#fff0df] flex items-center justify-center text-2xl">
                  📧
                </div>

                <div>

                  <h3 className="font-bold text-lg text-[#6b2e0b]">
                    Email Support
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Send us an email and we'll get
                    back to you.
                  </p>

                  <a
                    href="mailto:d.sairoshan986@gmail.com"
                    className="inline-block mt-3 font-semibold text-[#b84d00] hover:underline"
                  >
                    d.sairoshan986@gmail.com
                  </a>

                </div>

              </div>

            </div>


            {/* =================================================
                PHONE SUPPORT
            ================================================= */}

            <div className="mt-5 bg-white rounded-2xl p-6 shadow-md border border-[#f0dfce]">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#fff0df] flex items-center justify-center text-2xl">
                  📞
                </div>

                <div>

                  <h3 className="font-bold text-lg text-[#6b2e0b]">
                    Phone Support
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Talk directly with our support
                    team.
                  </p>

                  <a
                    href="tel:+919963781985"
                    className="inline-block mt-3 font-semibold text-[#b84d00] hover:underline"
                  >
                    +91 9963781985
                  </a>

                </div>

              </div>

            </div>


            {/* =================================================
                WHATSAPP
            ================================================= */}

            <div className="mt-5 bg-white rounded-2xl p-6 shadow-md border border-[#f0dfce]">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#fff0df] flex items-center justify-center text-2xl">
                  💬
                </div>

                <div>

                  <h3 className="font-bold text-lg text-[#6b2e0b]">
                    WhatsApp
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Message us for quick assistance.
                  </p>

                  <a
                    href="https://wa.me/919963781985"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 font-semibold text-[#b84d00] hover:underline"
                  >
                    Chat on WhatsApp
                  </a>

                </div>

              </div>

            </div>


            {/* =================================================
                BUSINESS HOURS
            ================================================= */}

            <div className="mt-5 bg-white rounded-2xl p-6 shadow-md border border-[#f0dfce]">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#fff0df] flex items-center justify-center text-2xl">
                  🕘
                </div>

                <div>

                  <h3 className="font-bold text-lg text-[#6b2e0b]">
                    Business Hours
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Monday - Sunday
                  </p>

                  <p className="font-semibold text-[#b84d00] mt-1">
                    9:00 AM - 7:00 PM
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <div>

            <div className="bg-white rounded-3xl shadow-xl border border-[#f0dfce] p-8">

              <h2 className="text-3xl font-bold text-[#6b2e0b]">
                Send Us a Message
              </h2>

              <p className="mt-3 text-gray-600">
                Fill out the form below and we'll
                help you with your request.
              </p>


              {/* =================================================
                  SUCCESS MESSAGE
              ================================================= */}

              {submitted && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                  Your email application should now
                  open with your support request.
                </div>
              )}


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
                  />

                </div>


                {/* SUBJECT */}

                <div>

                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 outline-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
                  >

                    <option value="">
                      Select a subject
                    </option>

                    <option value="Order Question">
                      Order Question
                    </option>

                    <option value="Delivery">
                      Delivery
                    </option>

                    <option value="Product Question">
                      Product Question
                    </option>

                    <option value="Payment">
                      Payment
                    </option>

                    <option value="Refund">
                      Refund
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* MESSAGE */}

                <div>

                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none resize-none focus:border-[#b84d00] focus:ring-2 focus:ring-[#b84d00]/20"
                  />

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#b84d00] px-6 py-4 text-white font-bold text-lg shadow-md transition hover:bg-[#963f00] hover:shadow-lg"
                >
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          QUICK HELP
          
          BROWSE CHOCOLATES REMOVED
      ================================================= */}

      <section className="px-6 pb-16">

        <div className="max-w-6xl mx-auto">

          <div className="bg-[#6b2e0b] rounded-3xl p-10 text-center text-white">

            <h2 className="text-3xl font-bold">
              Looking for something else?
            </h2>

            <p className="mt-3 text-[#f8dfc5]">
              You can check your previous orders.
            </p>


            {/* =================================================
                ONLY MY ORDERS BUTTON
            ================================================= */}

            <div className="mt-7 flex justify-center">

              <Link
                to="/orders"
                className="rounded-xl border border-white px-6 py-3 font-bold text-white hover:bg-white hover:text-[#6b2e0b] transition"
              >
                My Orders
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ContactSupport;