import React from 'react';
import { Shield, Clock, DollarSign, Users, Award, Headphones } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All our drivers are verified and vehicles are regularly inspected for your safety.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock service ensures you can book a ride anytime, anywhere.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden charges. Clear, upfront pricing for all our services.',
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Courteous, experienced drivers who know the best routes and prioritize your comfort.',
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'Maintaining the highest standards of service with well-maintained vehicles.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to assist you with any queries.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Happy Ride Drop?</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We're committed to providing the best taxi service experience with our focus on safety, 
            reliability, and customer satisfaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-emerald-50 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;