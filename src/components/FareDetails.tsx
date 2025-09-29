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
    <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full mb-6">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fare Details Above</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
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
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Information</h3>
                <ul className="text-amber-700 space-y-1 text-sm">
                  <li>• All charges are clearly mentioned and agreed upon before the trip</li>
                  <li>• Driver allowance includes food and accommodation during outstation trips</li>
                  <li>• Waiting charges apply only after the first hour of waiting time</li>
                  <li>• Hill station charges are additional due to difficult terrain and vehicle wear</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact for Clarification */}
          <div className="text-center bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Clarification on Pricing?</h3>
            <p className="text-gray-600 mb-6">
              Our customer support team is available 24/7 to explain any fare details 
              and provide accurate quotes for your specific journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919087520500"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold"
              >
                <IndianRupee className="w-4 h-4 mr-2" />
                Get Fare Quote
              </a>
              <button
                onClick={() => {
                  const message = encodeURIComponent('Hi! I need clarification on your fare details and pricing structure.');
                  window.open(`https://wa.me/919087520500?text=${message}`, '_blank');
                }}
                className="inline-flex items-center px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-300 font-semibold"
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