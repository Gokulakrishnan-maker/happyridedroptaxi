import React from 'react';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/Screenshot 2025-09-29 134405.png")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-blue-800/20 to-emerald-800/25"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Happy Ride Drop
              <span className="block text-3xl md:text-4xl font-normal text-emerald-200 mt-2 drop-shadow-xl">
                Premium Taxi Service
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white leading-relaxed drop-shadow-lg">
              Your comfort and safety is our priority. Professional drivers, clean vehicles, 
              and reliable service for all your travel needs.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/20">
              <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-md">Safe & Secure</h3>
              <p className="text-white drop-shadow-sm">Verified drivers and GPS tracking</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/20">
              <Clock className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-md">24/7 Available</h3>
              <p className="text-white drop-shadow-sm">Round the clock service</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 hover:bg-white/30 transition-all duration-300 border border-white/20">
              <Star className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-md">5-Star Service</h3>
              <p className="text-white drop-shadow-sm">Exceptional customer experience</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToBooking}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Book Your Ride Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
    </section>
  );
};

export default Hero;