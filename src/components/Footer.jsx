import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white/70 py-10">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-white font-semibold">Tide & Wisdom</div>
          <p className="text-sm">Gentle guidance for modern lives.</p>
        </div>
        <div className="text-sm">© {new Date().getFullYear()} All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;