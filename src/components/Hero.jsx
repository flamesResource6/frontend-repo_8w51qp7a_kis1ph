import React, { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.9);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(DPR, DPR);

    const STAR_COUNT = Math.floor((width * height) / 2500);
    const stars = new Array(STAR_COUNT).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2, // depth
      r: Math.random() * 1.2 + 0.3,
      tw: Math.random() * 0.05 + 0.01, // twinkle speed
      t: Math.random() * Math.PI * 2,
    }));

    const shooting = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 };
    let lastShoot = 0;

    const gradientSpace = ctx.createLinearGradient(0, 0, 0, height);
    gradientSpace.addColorStop(0, '#0b1025');
    gradientSpace.addColorStop(0.6, '#0a0720');
    gradientSpace.addColorStop(1, '#050312');

    const draw = (t) => {
      ctx.fillStyle = gradientSpace;
      ctx.fillRect(0, 0, width, height);

      // subtle nebula glows
      const glow = (gx, gy, gr, color, alpha) => {
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, `rgba(${color}, ${alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      };
      glow(width * 0.25, height * 0.3, Math.min(width, height) * 0.5, '120, 80, 255', 0.18);
      glow(width * 0.75, height * 0.7, Math.min(width, height) * 0.45, '60, 180, 255', 0.14);

      // stars
      stars.forEach((s) => {
        s.t += s.tw;
        const twinkle = 0.6 + Math.sin(s.t) * 0.4;
        const size = s.r * (1 + s.z * 0.8) * twinkle;

        // parallax drift
        s.x += 0.02 * (1 - s.z);
        if (s.x > width + 2) s.x = -2;

        ctx.shadowBlur = 8 * s.z * twinkle;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fillStyle = `rgba(${200 + 55 * s.z | 0}, ${200 + 30 * s.z | 0}, 255, ${0.85})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // occasional shooting star
      if (!shooting.active && t - lastShoot > 3000 && Math.random() < 0.01) {
        shooting.active = true;
        lastShoot = t;
        shooting.x = Math.random() * width * 0.4 + width * 0.3;
        shooting.y = -20;
        const speed = 6 + Math.random() * 3;
        const angle = Math.PI * (0.65 + Math.random() * 0.08);
        shooting.vx = Math.cos(angle) * speed;
        shooting.vy = Math.sin(angle) * speed;
        shooting.life = 0;
      }
      if (shooting.active) {
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        shooting.life += 1;

        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(shooting.x - shooting.vx * 4, shooting.y - shooting.vy * 4);
        ctx.stroke();

        if (shooting.x < -50 || shooting.y > height + 50 || shooting.life > 120) {
          shooting.active = false;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight * 0.9;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-[#050312]">
      <div className="absolute inset-0">
        <StarfieldBackground />
      </div>

      <div className="relative z-10 min-h-[90vh] flex items-center">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs md:text-sm text-white ring-1 ring-white/20">Cosmic calm • Guided clarity</span>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              Book spiritual guidance among the stars
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-white/90 max-w-xl">
              Gentle, one-on-one sessions with trusted advisors. Breathe in, look up, and discover your next step.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#book" className="inline-flex items-center justify-center rounded-xl bg-white/90 text-slate-900 px-6 py-3 font-medium shadow-lg shadow-indigo-900/30 hover:bg-white transition">Book a session</a>
              <a href="#advisors" className="inline-flex items-center justify-center rounded-xl bg-indigo-500/20 text-white px-6 py-3 font-medium ring-1 ring-white/20 hover:bg-indigo-500/30 transition">Meet advisors</a>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-fuchsia-950/20 to-[#050312]"></div>
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30" style={{background:"radial-gradient(600px 300px at 20% 20%, rgba(88,101,242,0.25), transparent 60%), radial-gradient(500px 260px at 80% 70%, rgba(255,100,200,0.18), transparent 60%)"}}></div>
    </section>
  );
};

export default Hero;
