import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { FaEnvelope, FaUser, FaCommentDots } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert("✅ Message sent successfully!");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("FAILED...", error);
          alert("❌ Oops! Something went wrong.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 py-16 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Info */}
        <div className="space-y-8 px-4 flex flex-col items-center md:items-start">
          <div className="relative mb-6">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 opacity-30 rounded-full blur-2xl animate-pulse"></div>
            <CiMail className="text-7xl text-indigo-500 drop-shadow-lg z-10 relative" />
          </div>
          <div className="text-gray-700 space-y-3 text-lg font-medium">
            <p>
              <span className="font-bold text-indigo-700">Contact Information</span>
            </p>
            <p>
              <span className="font-semibold text-indigo-600">Email:</span> aashishpar8980@gmail.com
            </p>
            <p>
              <span className="font-semibold text-indigo-600">Location:</span> Ahmedabad, India
            </p>
            <p>
              <span className="font-semibold text-indigo-600">Open to:</span> Full-time | Freelance | Remote
            </p>
          </div>
        </div>

        {/* Right Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-lg shadow-2xl border border-indigo-100 p-10 rounded-3xl space-y-8 animate-fade-in"
        >
          <h3 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">
            Send a Message
          </h3>

          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <FaUser className="mr-2 text-indigo-500" /> Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 bg-white/80 shadow-sm"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <FaEnvelope className="mr-2 text-indigo-500" /> Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 bg-white/80 shadow-sm"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <FaCommentDots className="mr-2 text-indigo-500" /> Message
            </label>
            <textarea
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              className="w-full border border-indigo-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 bg-white/80 shadow-sm resize-none"
              placeholder="Type your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>✉️</span> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
