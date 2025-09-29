import React, { useState } from 'react';
import { Menu, X, Phone, Mail, Car } from 'lucide-react';

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
    <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">+91 9087520500</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">happyridedroptaxi@gmail.com</span>
            </div>
          </div>
          <div className="text-gray-600">
            24/7 Service Available
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Happy Ride Drop</h1>
              <p className="text-sm text-gray-600">Premium Taxi Service</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Book Now
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="tel:+919087520500"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Call Now
            </a>
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
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('booking')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Book Now
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </button>
              <a
                href="tel:+919087520500"
                className="inline-flex items-center text-red-600 font-semibold"
              >
                <Phone className="w-4 h-4 mr-2" />
                +91 9087520500
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;