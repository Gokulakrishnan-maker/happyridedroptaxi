import React from 'react';
import { ArrowRight, Phone, MapPin, Clock } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/25"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
              Best Taxi Service
              <span className="block text-4xl md:text-5xl text-yellow-400 mt-2">
                ONE WAY RIDER
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed drop-shadow-lg">
              Professional taxi service with experienced drivers. Safe, comfortable, 
              and reliable transportation for all your travel needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="tel:+919087520500"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 drop-shadow-lg"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Now
              </a>
              <button
                onClick={scrollToBooking}
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 drop-shadow-lg"
              >
                Book Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="drop-shadow-md">24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="drop-shadow-md">All Tamil Nadu</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="drop-shadow-md">+91 9087520500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;