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

    const STAR_COUNT = Math.floor((width * height) / 2200);
    const stars = new Array(STAR_COUNT).fill(0).map(() => {
      const z = Math.random() * 0.8 + 0.2; // depth
      const speedBase = (1 - z) * 0.05; // slower if "deeper"
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        r: Math.random() * 1.3 + 0.4,
        tw: Math.random() * 0.035 + 0.015, // twinkle speed
        t: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * speedBase,
        vy: (Math.random() - 0.5) * speedBase,
      };
    });

    const shooting = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 };
    let lastShoot = 0;
    let time = 0;

    const draw = (ts) => {
      time = ts * 0.001; // seconds

      // animated deep space gradient by subtle translation
      const offsetX = Math.sin(time * 0.05) * 20;
      const offsetY = Math.cos(time * 0.04) * 15;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      const gradientSpace = ctx.createLinearGradient(0, 0, 0, height + 100);
      gradientSpace.addColorStop(0, '#0b1025');
      gradientSpace.addColorStop(0.6, '#0a0720');
      gradientSpace.addColorStop(1, '#050312');
      ctx.fillStyle = gradientSpace;
      ctx.fillRect(-offsetX, -offsetY, width + Math.abs(offsetX) * 2, height + Math.abs(offsetY) * 2);
      ctx.restore();

      // subtle nebula glows that drift
      const nebulaDriftX = Math.sin(time * 0.03) * 40;
      const nebulaDriftY = Math.cos(time * 0.025) * 30;
      const glow = (gx, gy, gr, color, alpha) => {
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        g.addColorStop(0, `rgba(${color}, ${alpha})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
      };
      glow(width * 0.22 + nebulaDriftX, height * 0.32 + nebulaDriftY, Math.min(width, height) * 0.5, '120, 80, 255', 0.20);
      glow(width * 0.78 - nebulaDriftX * 0.6, height * 0.68 - nebulaDriftY * 0.6, Math.min(width, height) * 0.45, '60, 180, 255', 0.16);

      // stars
      stars.forEach((s) => {
        s.t += s.tw;
        const twinkle = 0.7 + Math.sin(s.t) * 0.5; // brighter twinkle
        const size = s.r * (1 + s.z * 0.9) * twinkle;

        // gentle drift
        s.x += s.vx + 0.01 * (1 - s.z);
        s.y += s.vy + 0.006 * (1 - s.z);

        // wrap around edges
        if (s.x > width + 2) s.x = -2;
        if (s.x < -2) s.x = width + 2;
        if (s.y > height + 2) s.y = -2;
        if (s.y < -2) s.y = height + 2;

        // glowing star with soft halo
        const hueR = (200 + 55 * s.z) | 0;
        const hueG = (200 + 30 * s.z) | 0;
        const colorCore = `rgba(${hueR}, ${hueG}, 255, 1)`;
        const colorGlow = `rgba(${hueR}, ${hueG}, 255, ${0.35 + 0.3 * s.z})`;

        const glowRadius = size * (4 + 2 * s.z);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        g.addColorStop(0, colorCore);
        g.addColorStop(0.35, colorGlow);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = colorCore;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // occasional shooting star
      if (!shooting.active && ts - lastShoot > 3500 && Math.random() < 0.012) {
        shooting.active = true;
        lastShoot = ts;
        shooting.x = Math.random() * width * 0.4 + width * 0.3;
        shooting.y = -20;
        const speed = 5 + Math.random() * 2.5;
        const angle = Math.PI * (0.65 + Math.random() * 0.08);
        shooting.vx = Math.cos(angle) * speed;
        shooting.vy = Math.sin(angle) * speed;
        shooting.life = 0;
      }
      if (shooting.active) {
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        shooting.life += 1;

        const tailLen = 5;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(shooting.x - shooting.vx * tailLen, shooting.y - shooting.vy * tailLen);
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
