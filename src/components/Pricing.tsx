import React from 'react';
import { Check, Car, IndianRupee, ArrowRight, RotateCcw } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Sedan',
    image: 'https://happyridedroptaxi.com/assets/sedan.png',
    price: '₹14/km',
    description: 'Comfortable and affordable',
    features: [
      'AC Vehicle',
      'Professional Driver',
      '4 Passengers',
      'Luggage Space',
      'GPS Tracking',
      'Customer Support',
    ],
    popular: false,
  },
   {
    name: 'Etios',
    image: 'https://happyridedroptaxi.com/assets/etios.png', 
    price: '₹15/km',
    description: 'Reliable and efficient',
    features: [
      'AC Vehicle',
      'Professional Driver',
      '4 Passengers',
      'Luggage Space',
      'GPS Tracking',
      'Customer Support',
    ],
    popular: true,
  },
  {
    name: 'SUV',
    image: 'https://happyridedroptaxi.com/assets/suv.png', // Put this in public/assets
    price: '₹19/km',
    description: 'Spacious and premium',
    features: [
      'AC Vehicle',
      'Professional Driver',
      '6-7 Passengers',
      'Extra Luggage Space',
      'GPS Tracking',
      'Premium Comfort',
      'Customer Support',
    ],
    popular: false,
  },
  {
    name: 'Innova',
    image: 'https://happyridedroptaxi.com/assets/innova.png', // Put this in public/assets
    price: '₹20/km',
    description: 'Luxury and comfort',
    features: [
      'AC Vehicle',
      'Professional Driver',
      '6-7 Passengers',
      'Maximum Comfort',
      'GPS Tracking',
      'Premium Interior',
      'Complimentary Water',
      'Customer Support',
    ],
    popular: false,
  },
    {
    name: 'Innova Crysta',
    image: 'https://happyridedroptaxi.com//assets/innova-crysta.png',
    price: '₹24/km',
    description: 'Premium comfort and space',
    features: [
      'AC Vehicle',
      'Professional Driver',
      '6-7 Passengers',
      'Maximum Comfort',
      'GPS Tracking',
      'Premium Interior',
      'Complimentary Water',
      'Customer Support',
    ],
    popular: false,
  },
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Transparent Pricing</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Choose from our range of vehicles with clear, upfront pricing. No hidden charges, 
            just reliable service at competitive rates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-300 shadow-xl' 
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-72 h-72 mx-auto mb-4 object-contain transform transition-transform duration-300 hover:scale-105"
                 />   
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                <p className="text-gray-500 text-sm">Per kilometer</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  const element = document.getElementById('booking');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-lg'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Book {plan.name}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 max-w-4xl mx-auto">
            <Car className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Tariff Details</h3>
            
            {/* One Way Tariff */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-blue-600 mr-2" />
                <h4 className="text-xl font-bold text-gray-800">One Way Tariff</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Vehicle Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Rate/KM</th>
                      <th className="px-4 py-3 text-left font-semibold">Driver Bata</th>
                      <th className="px-4 py-3 text-left font-semibold">Additional Charge</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SEDAN</td>
                      <td className="px-4 py-3">₹14/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">ETIOS</td>
                      <td className="px-4 py-3">₹14/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SUV</td>
                      <td className="px-4 py-3">₹19/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">One way Toll</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">INNOVA</td>
                      <td className="px-4 py-3">₹20/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">One way Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Round Trip Tariff */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-emerald-600 mr-2" />
                <h4 className="text-xl font-bold text-gray-800">Round Trip Tariff</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
                  <thead className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Vehicle Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Rate/KM</th>
                      <th className="px-4 py-3 text-left font-semibold">Driver Bata</th>
                      <th className="px-4 py-3 text-left font-semibold">Additional Charge</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SEDAN</td>
                      <td className="px-4 py-3">₹13/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">Up & Down Toll</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">ETIOS</td>
                      <td className="px-4 py-3">₹13/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">Up & Down Toll</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">SUV</td>
                      <td className="px-4 py-3">₹18/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">Up & Down Toll</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">INNOVA</td>
                      <td className="px-4 py-3">₹18/KM</td>
                      <td className="px-4 py-3">₹400</td>
                      <td className="px-4 py-3">Up & Down Toll</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Minimum Distance:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• One-way trips: 130 km minimum</li>
                  <li>• Round-trip: 250 km minimum</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Additional Charges:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Driver allowance: ₹300/day</li>
                  <li>• Toll charges as applicable</li>
                  <li>• Parking charges if any</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;