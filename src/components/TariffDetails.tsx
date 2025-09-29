import React from 'react';
import { IndianRupee, ArrowRight, RotateCcw, Car, Info } from 'lucide-react';

const TariffDetails: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-black/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-black to-yellow-600 rounded-full mb-6">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-black mb-4">Tariff Details</h2>
            <p className="text-gray-700 text-lg max-w-3xl mx-auto font-semibold">
              Complete breakdown of our transparent pricing structure. No hidden charges, 
              all costs clearly mentioned upfront for your convenience.
            </p>
          </div>

          {/* One Way Tariff */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <ArrowRight className="w-6 h-6 text-black mr-2" />
              <h3 className="text-2xl font-bold text-black">One Way Tariff</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg border-4 border-yellow-400">
                <thead className="bg-gradient-to-r from-black to-yellow-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Vehicle Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Rate/KM</th>
                    <th className="px-6 py-4 text-left font-semibold">Driver Bata</th>
                    <th className="px-6 py-4 text-left font-semibold">Additional Charge</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">SEDAN</td>
                    <td className="px-6 py-4">₹14/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">One way Toll</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">ETIOS</td>
                    <td className="px-6 py-4">₹14/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">One way Toll</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">SUV</td>
                    <td className="px-6 py-4">₹19/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">One way Toll</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">INNOVA</td>
                    <td className="px-6 py-4">₹20/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">One way Toll</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Round Trip Tariff */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <RotateCcw className="w-6 h-6 text-black mr-2" />
              <h3 className="text-2xl font-bold text-black">Round Trip Tariff</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg border-4 border-yellow-400">
                <thead className="bg-gradient-to-r from-yellow-600 to-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Vehicle Type</th>
                    <th className="px-6 py-4 text-left font-semibold">Rate/KM</th>
                    <th className="px-6 py-4 text-left font-semibold">Driver Bata</th>
                    <th className="px-6 py-4 text-left font-semibold">Additional Charge</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">SEDAN</td>
                    <td className="px-6 py-4">₹13/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">Up & Down Toll</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">ETIOS</td>
                    <td className="px-6 py-4">₹13/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">Up & Down Toll</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">SUV</td>
                    <td className="px-6 py-4">₹18/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">Up & Down Toll</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-black">INNOVA</td>
                    <td className="px-6 py-4">₹18/KM</td>
                    <td className="px-6 py-4">₹400</td>
                    <td className="px-6 py-4">Up & Down Toll</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-center bg-white rounded-xl p-8 shadow-lg border-4 border-yellow-400">
            <Car className="w-12 h-12 text-black mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-4">Additional Information</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-bold text-black mb-2">Minimum Distance:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• One-way trips: 130 km minimum</li>
                  <li>• Round-trip: 250 km minimum</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-black mb-2">Additional Charges:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Driver allowance: ₹400/day</li>
                  <li>• Toll charges as applicable</li>
                  <li>• Parking charges if any</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                href="tel:+919087520500"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-bold"
              >
                <IndianRupee className="w-4 h-4 mr-2" />
                Get Fare Quote
              </a>
              <button
                onClick={() => {
                  const message = encodeURIComponent('Hi! I need clarification on your tariff details and pricing structure.');
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

export default TariffDetails;