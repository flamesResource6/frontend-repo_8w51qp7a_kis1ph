import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Advisors = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const res = await fetch(`${API_URL}/api/advisors`);
        const data = await res.json();
        setAdvisors(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisors();
  }, []);

  return (
    <section id="advisors" className="relative py-16 md:py-24 bg-gradient-to-b from-sky-950 to-sky-950/80">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">Guides you can trust</h2>
        <p className="mt-2 text-white/80 max-w-xl">Handpicked advisors with warm presence and deep listening.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full text-white/70">Loading advisors...</div>
          )}
          {!loading && advisors.length === 0 && (
            <div className="col-span-full text-white/70">Advisors will appear once the database connects.</div>
          )}
          {advisors.map((a) => (
            <div key={a.id} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-800">
                {a.photo ? (
                  <img src={a.photo} alt={a.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-white/50">No photo</div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-white font-medium text-lg">{a.name}</h3>
                <p className="text-white/70 text-sm">{a.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.isArray(a.specialties) && a.specialties.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advisors;