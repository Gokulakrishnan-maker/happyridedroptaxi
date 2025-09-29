import React from 'react';
import { IndianRupee, Clock, MapPin, Car, AlertCircle, Info } from 'lucide-react';

const FareDetails: React.FC = () => {
  const fareItems = [
    {
      icon: IndianRupee,
      title: 'Toll Fees & Inter State Permit Charges',
      description: 'If any are extra',
      color: 'text-blue-600'
    },
    {
      icon: Car,
      title: 'Drop Trips Driver Bata',
      description: 'Sedan Rs.400 & SUV Rs.500 - Waiting Charges Rs.100 per hour',
      color: 'text-emerald-600'
    },
    {
      icon: Clock,
      title: 'Drop Trips - Minimum Running',
      description: 'Must be 130kms per day',
      color: 'text-orange-600'
    },
    {
      icon: MapPin,
      title: 'Round Trips - Driver Bata',
      description: 'Sedan Rs.400 & SUV Rs.500/- per day',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Round Trips - Minimum Running',
      description: 'Must be 250kms per day. For Bangalore it is minimum 300kms per day',
      color: 'text-red-600'
    },
    {
      icon: MapPin,
      title: 'Hill Station Charges',
      description: 'Sedan Rs.400 & SUV Rs.500',
      color: 'text-teal-600'
    },
    {
      icon: Clock,
      title: '1 Day Means 1 Calendar Day',
      description: 'From midnight 12 to Next Midnight 12',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-black/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-black to-yellow-600 rounded-full mb-6">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-black mb-4">Fare Details Above</h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto font-semibold">
              Complete breakdown of our transparent pricing structure. No hidden charges, 
              all costs clearly mentioned upfront for your convenience.
            </p>
          </div>

          {/* Fare Details Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {fareItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-yellow-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed font-semibold">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-black rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-black mb-2">Important Information</h3>
                <ul className="text-gray-700 space-y-1 text-sm font-semibold">
                  <li>• All charges are clearly mentioned and agreed upon before the trip</li>
                  <li>• Driver allowance includes food and accommodation during outstation trips</li>
                  <li>• Waiting charges apply only after the first hour of waiting time</li>
                  <li>• Hill station charges are additional due to difficult terrain and vehicle wear</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact for Clarification */}
          <div className="text-center bg-white rounded-xl p-8 shadow-lg border-4 border-yellow-400">
            <h3 className="text-2xl font-bold text-black mb-4">Need Clarification on Pricing?</h3>
            <p className="text-gray-700 mb-6 font-semibold">
              Our customer support team is available 24/7 to explain any fare details 
              and provide accurate quotes for your specific journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919087520500"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-bold"
              >
                <IndianRupee className="w-4 h-4 mr-2" />
                Get Fare Quote
              </a>
              <button
                onClick={() => {
                  const message = encodeURIComponent('Hi! I need clarification on your fare details and pricing structure.');
                  window.open(`https://wa.me/919087520500?text=${message}`, '_blank');
                }}
                className="inline-flex items-center px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-yellow-400 transition-all duration-300 font-bold"
              >
                <Info className="w-4 h-4 mr-2" />
                Ask Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FareDetails;