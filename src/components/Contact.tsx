import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi! I would like to inquire about your taxi services. Please provide more details.');
    window.open(`https://wa.me/919087520500?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Get in Touch</h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto font-semibold">
            Have questions or need assistance? Our customer support team is here to help you 24/7
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="mx-auto">
            <h3 className="text-2xl font-bold text-black mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Phone Number</h4>
                  <p className="text-gray-700 font-semibold">+91 9087520500</p>
                  <p className="text-sm text-gray-600 font-semibold">Available 24/7 for bookings and support</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-2 border-yellow-300">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Email Address</h4>
                  <p className="text-gray-700 font-semibold">happyridedroptaxi@gmail.com</p>
                  <p className="text-sm text-gray-600 font-semibold">We'll respond within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">WhatsApp</h4>
                  <p className="text-gray-700 font-semibold">+91 9087520500</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-sm text-black hover:text-yellow-600 underline mt-1 font-semibold"
                  >
                    Chat with us now →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl border-2 border-yellow-300">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Business Hours</h4>
                  <p className="text-gray-700 font-semibold">24/7 Service Available</p>
                  <p className="text-sm text-gray-600 font-semibold">Round the clock taxi service</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-300">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-black mb-1">Service Area</h4>
                  <p className="text-gray-700 font-semibold">Chennai & Outstation</p>
                  <p className="text-sm text-gray-600 font-semibold">Covering Tamil Nadu and neighboring states</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-700 mb-4 font-semibold">For immediate assistance, call us or chat on WhatsApp</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+919087520500"
                  className="inline-flex items-center px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-bold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center px-6 py-3 bg-black text-yellow-400 rounded-lg hover:bg-gray-800 transition-colors font-bold"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;