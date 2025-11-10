import React, { useState } from "react";

export default function Candidates() {
  const [formData, setFormData] = useState({
    sheet: "candidates",
    name: "",
    email: "",
    phone: "",
    experience: "",
    jobRole: "",
    resumeLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Replace with your actual Google Apps Script Web App URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Send data directly to Google Sheet
      const response = await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log("Google Sheet Response:", text);

      if (response.ok) {
        setMessage("✅ Your application has been submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          experience: "",
          jobRole: "",
          resumeLink: "",
        });
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="candidates" className="bg-gray-50 py-20 px-4 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Join Elevate Byte</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Submit your details below to explore exciting IT opportunities with top
        U.S. clients.
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg"
      >
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g., 2 years in React)"
            value={formData.experience}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            name="jobRole"
            placeholder="which role you looking for (e.g., Frontend Developer)"
            value={formData.jobRole}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />

          {/* ✅ Resume Link Field */}
          <input
            type="url"
            name="resumeLink"
            placeholder="Google Drive Resume Link"
            value={formData.resumeLink}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg w-full"
          />
          <p className="text-sm text-gray-500 text-left">
            🔗 Make sure your Google Drive link is set to{" "}
            <b>“Anyone with the link can view.”</b>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        {message && <p className="mt-4 text-lg text-green-600">{message}</p>}
      </form>
    </section>
  );
}
