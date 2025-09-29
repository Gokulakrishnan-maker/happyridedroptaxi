import React from 'react';
import { MapPin, Camera, Clock, Star, Waves, Mountain, Building } from 'lucide-react';

const TamilNaduDestinations: React.FC = () => {
  const destinations = [
    {
      name: 'Madurai',
      image: 'https://images.pexels.com/photos/1007025/pexels-photo-1007025.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '220 km',
      duration: '4-5 hours',
      description: 'Temple city with Meenakshi Amman Temple',
      icon: Building,
      highlights: ['Meenakshi Temple', 'Thirumalai Nayak Palace', 'Gandhi Museum', 'Local Markets']
    },
    {
      name: 'Thanjavur',
     image: 'https://images.pexels.com/photos/9166266/pexels-photo-9166266.jpeg?auto=compress&cs=tinysrgb&w=400',
     distance: '350 km from Chennai',
     duration: '6-7 hours',
     description: 'Historic city famous for the Brihadeeswarar Temple, Chola architecture, and rich cultural heritage',
     icon: Building,
     highlights: ['Brihadeeswarar Temple', 'Chola Architecture', 'Art & Culture', 'UNESCO Heritage']
    },
    {
      name: 'Ooty Hill Station',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      category: 'Hill Station',
      description: 'Queen of Hill Stations with tea gardens and cool climate',
      distance: '540 km from Chennai',
      duration: '9-10 hours',
      highlights: ['Tea Gardens', 'Cool Climate', 'Scenic Beauty']
    },
    {
    name: 'Rameswaram',
    image: 'https://images.pexels.com/photos/8078361/pexels-photo-8078361.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: '560 km from Chennai',
    duration: '9-10 hours',
    description: 'Sacred island town with the famous Rameswaram Temple and pristine beaches',
    icon: Building,
    highlights: ['Rameswaram Temple', 'Sacred Waters', 'Beach Views', 'Pilgrimage']
    },
    {
      name: 'Kanyakumari',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVYkyFjgbLCZ9CbI90sWef31in22ymqHp-KQ&s',
      distance: '450 km',
      duration: '8-9 hours',
      description: 'Southernmost tip with Thiruvalluvar Statue',
      icon: Waves,
      highlights: ['Thiruvalluvar Statue', 'Sunset Point', 'Vivekananda Rock', 'Beach']
    },
    {
    name: 'Tirupati',
    image: 'https://images.pexels.com/photos/9166266/pexels-photo-9166266.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: '150 km from Chennai',
    duration: '3 hours',
    description: 'Famous pilgrimage city with the world-renowned Venkateswara Temple',
    icon: Building,
    highlights: ['Tirupati Balaji Temple', 'Spiritual Experience', 'Pilgrimage', 'Cultural Sites']
    },
    {
      name: 'Kodaikanal',
      image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '180 km',
      duration: '4 hours',
      description: 'Princess of Hill Stations with pristine lakes',
      icon: Mountain,
      highlights: ['Kodai Lake', 'Coakers Walk', 'Bryant Park', 'Pillar Rocks']
    },
    {
      name: 'Tirupati Balaji Temple',
      image: 'https://images.pexels.com/photos/9166266/pexels-photo-9166266.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      category: 'Temple',
      description: 'Most visited Hindu temple in the world',
      distance: '150 km from Chennai',
      duration: '3 hours',
      highlights: ['Sacred Pilgrimage', 'Lord Venkateswara', 'Spiritual']
    },
    {
    name: 'Coimbatore',
    image: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: '500 km from Chennai',
    duration: '8-9 hours',
    description: 'Industrial city known as Manchester of South India with temples and textile industry',
    icon: Building,
    highlights: ['Textile Industry', 'Marudamalai Temple', 'Industrial Hub', 'Gateway to Kerala']
  },
    
    {
    name: 'Trichy',
    image: 'https://images.pexels.com/photos/9166266/pexels-photo-9166266.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: '320 km from Chennai',
    duration: '5-6 hours',
    description: 'Historic city with Rock Fort and bustling markets',
    icon: Building,
    highlights: ['Rock Fort', 'Market Streets', 'Temples', 'Cultural Sites']
   },
        { 
      name: 'Mysore',
      image: 'https://images.pexels.com/photos/1007025/pexels-photo-1007025.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '280 km',
      duration: '5-6 hours',
      description: 'City of Palaces with rich heritage',
      icon: Building,
      highlights: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens', 'Silk Sarees']
    },
       {
    name: 'Pondicherry',
    image: 'https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400',
    distance: '160 km from Chennai',
    duration: '3-4 hours',
    description: 'French colonial charm with beaches, cafes, and serene coastal vibe',
    icon: Waves,
    highlights: ['French Quarter', 'Beaches', 'Cafes', 'Serene Walks']
    }                     
   ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Temple':
        return '🛕';
      case 'Hill Station':
        return '🏔️';
      case 'City':
        return '🏙️';
      case 'Tourist Place':
        return '🏖️';
      default:
        return '📍';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Temple':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Hill Station':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'City':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tourist Place':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore Tamil Nadu's Treasures</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover the rich heritage, stunning temples, scenic hill stations, and vibrant cities of Tamil Nadu. 
            We provide comfortable taxi services to all these amazing destinations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(destination.category)}`}>
                    <span className="mr-1">{getCategoryIcon(destination.category)}</span>
                    {destination.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {destination.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{destination.distance}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>{destination.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {destination.highlights.map((highlight, highlightIndex) => (
                    <span 
                      key={highlightIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    const element = document.getElementById('booking');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center justify-center group"
                >
                  <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book Trip to {destination.name.split(',')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 max-w-4xl mx-auto">
            <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Plan Your Tamil Nadu Adventure</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              From ancient temples to scenic hill stations, Tamil Nadu offers incredible diversity. 
              Our experienced drivers know the best routes and can guide you to hidden gems along the way.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-gray-600">Destinations Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">1000+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-gray-600">Service Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TamilNaduDestinations;