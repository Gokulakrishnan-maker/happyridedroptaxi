import React from 'react';
import { MapPin, ArrowRight, Clock } from 'lucide-react';

const PopularRoutes: React.FC = () => {
  const routes = [
    {
      from: 'Chennai',
      to: 'Bangalore',
      distance: '350 km',
      duration: '6-7 hours',
      price: '₹4,500',
    },
    {
      from: 'Chennai',
      to: 'Pondicherry',
      distance: '160 km',
      duration: '3-4 hours',
      price: '₹2,200',
    },
    {
      from: 'Chennai',
      to: 'Madurai',
      distance: '460 km',
      duration: '7-8 hours',
      price: '₹5,800',
    },
    {
      from: 'Chennai',
      to: 'Coimbatore',
      distance: '500 km',
      duration: '8-9 hours',
      price: '₹6,200',
    },
    {
      from: 'Chennai',
      to: 'Tirupati',
      distance: '150 km',
      duration: '3 hours',
      price: '₹2,000',
    },
    {
      from: 'Chennai',
      to: 'Kanyakumari',
      distance: '700 km',
      duration: '12 hours',
      price: '₹8,500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Routes</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover our most requested destinations with competitive pricing and reliable service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">{route.from}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-800">{route.to}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold text-gray-800">{route.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration:
                    </span>
                    <span className="font-semibold text-gray-800">{route.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Starting from:</span>
                    <span className="text-xl font-bold text-green-600">{route.price}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const element = document.getElementById('booking');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold"
                >
                  Book This Route
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Don't see your destination? We cover many more routes!
          </p>
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            Contact Us for Custom Routes
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;