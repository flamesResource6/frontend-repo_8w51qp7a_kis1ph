import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const BookingForm = () => {
  const [form, setForm] = useState({ name: '', email: '', topic: '', preferred_time: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Request received. We\'ll email you to confirm.' });
        setForm({ name: '', email: '', topic: '', preferred_time: '' });
      } else {
        setStatus({ type: 'error', message: data.detail || 'Something went wrong. Please try again.' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Unable to reach the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" className="relative py-16 md:py-24 bg-gradient-to-b from-sky-950/80 to-sky-950">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Book a session</h2>
          <p className="mt-2 text-white/80">Share a bit about what you need guidance on.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-white/40" placeholder="Alex Rivers" />
            </div>
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-white/40" placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">What do you seek guidance on?</label>
              <textarea name="topic" value={form.topic} onChange={handleChange} required rows={4} className="w-full rounded-xl bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-white/40" placeholder="Career crossroads, relationship clarity, emotional balance..." />
            </div>
            <div className="grid gap-2">
              <label className="text-white/80 text-sm">Preferred time</label>
              <input name="preferred_time" value={form.preferred_time} onChange={handleChange} className="w-full rounded-xl bg-white/10 text-white placeholder-white/50 px-4 py-3 outline-none ring-1 ring-white/20 focus:ring-white/40" placeholder="e.g. Wed 7pm, UTC+1" />
            </div>
            <div className="flex items-center gap-3">
              <button disabled={loading} className="inline-flex items-center justify-center rounded-xl bg-white/90 text-slate-900 px-6 py-3 font-medium shadow-lg shadow-sky-900/30 hover:bg-white transition disabled:opacity-60">{loading ? 'Sending...' : 'Request booking'}</button>
              {status && (
                <span className={`${status.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{status.message}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
