import React, { useState } from 'react';


export default function Clients() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = new FormData(e.target);

    try {
      // ✅ Send directly as FormData (no JSON.stringify)
      const resp = await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL_CLIENTS, {
        method: 'POST',
        body: form,
      });

      const rjson = await resp.json();

      if (rjson && rjson.success) {
        setStatus({ ok: true, msg: 'Thanks — we will contact you shortly.' });
        e.target.reset();
      } else {
        setStatus({ ok: false, msg: 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ ok: false, msg: 'Error: ' + err.message });
      e.target.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="clients" className="py-16 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-20">
        <h3 className="text-3xl font-bold text-primary text-center">
          For Clients
        </h3>
        <p className="text-slate-600 text-center mt-2">
          Tell us about your hiring needs and we'll get back within 24-48 hours.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mt-6 bg-white p-6 rounded-lg shadow space-y-4"
        >
          <input
            name="company"
            type="text"
            placeholder="Company Name"
            className="w-full p-3 rounded border"
            required
          />
          <input
            name="contactName"
            type="text"
            placeholder="Contact Person"
            className="w-full p-3 rounded border"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded border"
            required
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            className="w-full p-3 rounded border"
          />
          <input
            name="service"
            type="text"
            placeholder="Service Interested (e.g., US IT Recruitment)"
            className="w-full p-3 rounded border"
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Tell us about the role / needs"
            className="w-full p-3 rounded border"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded"
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
          {status && (
            <div
              className={`p-3 rounded ${
                status.ok
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {/* {status.msg} */}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
