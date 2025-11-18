import React from 'react';
import Hero from './components/Hero';
import Advisors from './components/Advisors';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-sky-950">
      <Hero />
      <Advisors />
      <BookingForm />
      <Footer />
    </div>
  );
}

export default App;