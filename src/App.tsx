import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import WhyChooseUs from './components/WhyChooseUs';
import PopularRoutes from './components/PopularRoutes';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SEO from './components/SEO';

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen">
        <SEO />
        <Header />
        <Hero />
        <BookingForm />
        <WhyChooseUs />
        <PopularRoutes />
        <Pricing />
        <Testimonials />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </HelmetProvider>
  );
}

export default App;