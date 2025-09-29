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
    <header className="bg-white/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white p-2 rounded-lg">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Happy Ride Drop</h1>
              <p className="text-sm text-gray-600">Taxi Service</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Book Now
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">+91 9087520500</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">happyridedroptaxi@gmail.com</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 mt-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('booking')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Book Now
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">+91 9087520500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">happyridedroptaxi@gmail.com</span>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;