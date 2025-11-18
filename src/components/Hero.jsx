import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/poZi6bJ4-Htwt04i/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs md:text-sm text-white ring-1 ring-white/20">Ocean calm • Guided clarity</span>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              Book spiritual guidance that feels like waves finding shore
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-white/90 max-w-xl">
              Gentle, one-on-one sessions with trusted advisors. Breathe in, release, and discover your next step.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#book" className="inline-flex items-center justify-center rounded-xl bg-white/90 text-slate-900 px-6 py-3 font-medium shadow-lg shadow-sky-900/30 hover:bg-white transition">Book a session</a>
              <a href="#advisors" className="inline-flex items-center justify-center rounded-xl bg-sky-500/20 text-white px-6 py-3 font-medium ring-1 ring-white/20 hover:bg-sky-500/30 transition">Meet advisors</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-950/40 via-sky-950/30 to-sky-950"></div>
    </section>
  );
};

export default Hero;