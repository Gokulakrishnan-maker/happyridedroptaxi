import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I would like to know more about your taxi services.');
    window.open(`https://wa.me/919087520500?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-2 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400">Happy Ride Drop</h3>
                <p className="text-yellow-300 text-sm font-semibold">Taxi Service</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 font-semibold">
              Your trusted partner for safe, comfortable, and reliable taxi services. 
              We prioritize your comfort and satisfaction in every journey.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleWhatsAppClick}
                className="bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('home');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('booking');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold"
                >
                  Book Now
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('services');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('pricing');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Our Services</h4>
            <ul className="space-y-2 text-gray-300 font-semibold">
              <li>Outstation Taxi</li>
              <li>Local Taxi</li>
              <li>Airport Transfer</li>
              <li>Corporate Travel</li>
              <li>Wedding Events</li>
              <li>Tourist Packages</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-300 font-semibold">+91 9087520500</p>
                  <p className="text-gray-400 text-sm font-semibold">24/7 Available</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-300 font-semibold">happyridedroptaxi@gmail.com</p>
                  <p className="text-gray-400 text-sm font-semibold">Quick Response</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-300 font-semibold">Chennai, Tamil Nadu</p>
                  <p className="text-gray-400 text-sm font-semibold">Service Area</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0 font-semibold">
              © 2024 Happy Ride Drop Taxi. All rights reserved. Designed by Gk WebDesigns
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
