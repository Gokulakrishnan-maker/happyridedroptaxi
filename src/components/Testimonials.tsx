import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Chennai',
      rating: 5,
      comment: 'Excellent service! The driver was punctual and the car was very clean. Highly recommend Happy Ride Drop for outstation trips.',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      comment: 'Amazing experience from Chennai to Pondicherry. Professional driver, comfortable ride, and reasonable pricing. Will book again!',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Arjun Patel',
      location: 'Mumbai',
      rating: 5,
      comment: 'Safe and reliable service. The car was well-maintained and the driver was courteous throughout the journey. Great value for money.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Meera Nair',
      location: 'Kerala',
      rating: 5,
      comment: 'Booked for a family trip to Madurai. The SUV was spacious and comfortable. Driver was helpful and knew the best routes. Excellent!',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Vikram Singh',
      location: 'Delhi',
      rating: 5,
      comment: 'Professional service with transparent pricing. No hidden charges and prompt customer support. Definitely recommend for long distance travel.',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Anitha Reddy',
      location: 'Hyderabad',
      rating: 5,
      comment: 'Smooth and hassle-free booking process. The driver arrived on time and the journey was comfortable. Great service overall!',
      avatar: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-black/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">What Our Customers Say</h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto font-semibold">
            Read genuine reviews from our satisfied customers who have experienced our premium taxi service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 border-2 border-yellow-300"
            >
              <div className="mb-6">
                <Quote className="w-10 h-10 text-yellow-300 mb-4" />
                <p className="text-gray-700 leading-relaxed italic font-semibold">"{testimonial.comment}"</p>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-black">{testimonial.name}</h4>
                  <p className="text-gray-700 text-sm font-semibold">{testimonial.location}</p>
                </div>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      className="w-5 h-5 text-yellow-400 fill-current" 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto shadow-lg border-4 border-yellow-400">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold text-black">4.9/5</span>
            </div>
            <p className="text-gray-700 text-lg font-semibold">
              Based on <strong>500+</strong> customer reviews
            </p>
            <p className="text-gray-600 mt-2 font-semibold">
              Join thousands of satisfied customers who trust Happy Ride Drop for their travel needs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;