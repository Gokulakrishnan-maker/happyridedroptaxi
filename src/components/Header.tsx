import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 fixed top-0 left-0 right-0 z-50 shadow-xl border-b-4 border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-black text-yellow-400 p-3 rounded-lg shadow-lg">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black drop-shadow-sm">Happy Ride Drop</h1>
              <p className="text-sm text-black font-semibold">Professional Taxi Service</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Book Now
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300"
            >
              Contact
            </button>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm bg-black/10 px-3 py-2 rounded-lg">
              <Phone className="w-4 h-4 text-black" />
              <span className="text-black font-semibold">+91 9087520500</span>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-black/10 px-3 py-2 rounded-lg">
              <Mail className="w-4 h-4 text-black" />
              <span className="text-black font-semibold">happyridedroptaxi@gmail.com</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-black hover:text-yellow-400 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t-2 border-black/20 bg-yellow-300/50 rounded-lg">
            <div className="flex flex-col space-y-4 mt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('booking')}
                className="text-left text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded transition-colors"
              >
                Book Now
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-black font-semibold hover:bg-black hover:text-yellow-400 px-3 py-2 rounded transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-black/20">
              <div className="flex items-center space-x-2 text-sm mb-2 bg-black/10 px-3 py-2 rounded">
                <Phone className="w-4 h-4 text-black" />
                <span className="text-black font-semibold">+91 9087520500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm bg-black/10 px-3 py-2 rounded">
                <Mail className="w-4 h-4 text-black" />
                <span className="text-black font-semibold">happyridedroptaxi@gmail.com</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;