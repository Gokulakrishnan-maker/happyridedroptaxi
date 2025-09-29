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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Have questions or need assistance? Our customer support team is here to help you 24/7
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Phone Number</h4>
                  <p className="text-gray-600">+91 9087520500</p>
                  <p className="text-sm text-gray-500">Available 24/7 for bookings and support</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email Address</h4>
                  <p className="text-gray-600">happyridedroptaxi@gmail.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">WhatsApp</h4>
                  <p className="text-gray-600">+91 9087520500</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-sm text-orange-600 hover:text-orange-700 underline mt-1"
                  >
                    Chat with us now →
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Business Hours</h4>
                  <p className="text-gray-600">24/7 Service Available</p>
                  <p className="text-sm text-gray-500">Round the clock taxi service</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Service Area</h4>
                  <p className="text-gray-600">Chennai & Outstation</p>
                  <p className="text-sm text-gray-500">Covering Tamil Nadu and neighboring states</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Quick Inquiry</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">For immediate assistance, call us or chat on WhatsApp</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+919087520500"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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