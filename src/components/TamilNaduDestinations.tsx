import React from 'react';
import { MapPin, Camera, Clock, Star, Waves, Mountain, Building } from 'lucide-react';

const TamilNaduDestinations: React.FC = () => {
  const destinations = [
    {
      name: 'Madurai',
      image: 'https://happyridedroptaxi.com/assets/meenakshi-amman-temple.png',
      distance: '460 km from Chennai',
      duration: '7-8 hours',
      description: 'Temple city with Meenakshi Amman Temple',
      icon: Building,
      highlights: ['Meenakshi Temple', 'Thirumalai Nayak Palace', 'Gandhi Museum', 'Local Markets']
    },
    {
      name: 'Thanjavur',
     image: 'https://happyridedroptaxi.com/assets/BrihadisvaraTemple.png',
     distance: '350 km from Chennai',
     duration: '6-7 hours',
     description: 'Historic city famous for the Brihadeeswarar Temple, Chola architecture, and rich cultural heritage',
     icon: Building,
     highlights: ['Brihadeeswarar Temple', 'Chola Architecture', 'Art & Culture', 'UNESCO Heritage']
    },
    {
      name: 'Ooty Hill Station',
      image: 'https://happyridedroptaxi.com/assets/ooty-hillstation.png',
      category: 'Hill Station',
      description: 'Queen of Hill Stations with tea gardens and cool climate',
      distance: '540 km from Chennai',
      duration: '9-10 hours',
      highlights: ['Tea Gardens', 'Cool Climate', 'Scenic Beauty']
    },
    {
    name: 'Rameswaram',
    image: 'https://happyridedroptaxi.com/assets/Ramanathaswamy-Temple.png',
    distance: '560 km from Chennai',
    duration: '9-10 hours',
    description: 'Sacred island town with the famous Rameswaram Temple and pristine beaches',
    icon: Building,
    highlights: ['Rameswaram Temple', 'Sacred Waters', 'Beach Views', 'Pilgrimage']
    },
    {
      name: 'Kanyakumari',
      image: 'https://happyridedroptaxi.com/assets/kanyakumari.png',
      distance: '700 km from Chennai',
      duration: '12 hours',
      description: 'Southernmost tip with Thiruvalluvar Statue',
      icon: Waves,
      highlights: ['Thiruvalluvar Statue', 'Sunset Point', 'Vivekananda Rock', 'Beach']
    },
     {
      name: 'Kodaikanal',
      image: 'https://happyridedroptaxi.com/assets/kodaikanal-hillstation.png',
      distance: '520 km from Chennai',
      duration: '8-9 hours',
      description: 'Princess of Hill Stations with pristine lakes',
      icon: Mountain,
      highlights: ['Kodai Lake', 'Coakers Walk', 'Bryant Park', 'Pillar Rocks']
    },
    {
    name: 'Tirupati',
    image: 'https://happyridedroptaxi.com/assets/tirupati.png',
    distance: '150 km from Chennai',
    duration: '3 hours',
    description: 'Famous pilgrimage city with the world-renowned Venkateswara Temple',
    icon: Building,
    highlights: ['Tirupati Balaji Temple', 'Spiritual Experience', 'Pilgrimage', 'Cultural Sites']
    },
    {
    name: 'Coimbatore',
    image: 'https://happyridedroptaxi.com/assets/coimbatore-isha.png',
    distance: '500 km from Chennai',
    duration: '8-9 hours',
    description: 'Industrial city known as Manchester of South India with temples and textile industry',
    icon: Building,
    highlights: ['Textile Industry', 'Marudamalai Temple', 'Industrial Hub', 'Gateway to Kerala']
  },
    
    {
    name: 'Trichy',
    image: 'https://happyridedroptaxi.com/assets/Srirangam-Temple.png',
    distance: '320 km from Chennai',
    duration: '5-6 hours',
    description: 'Historic city with Rock Fort and bustling markets',
    icon: Building,
    highlights: ['Rock Fort', 'Market Streets', 'Temples', 'Cultural Sites']
   },
        { 
      name: 'Mysore',
      image: 'https://happyridedroptaxi.com/assets/mysore-palace.png',
      distance: '500 km from Chennai',
      duration: '8-9 hours',
      description: 'City of Palaces with rich heritage',
      icon: Building,
      highlights: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens', 'Silk Sarees']
    },
       {
    name: 'Pondicherry',
    image: 'https://happyridedroptaxi.com/assets/pondicherry.png',
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
          <h2 className="text-4xl font-bold text-black mb-4">Explore Tamil Nadu's Treasures</h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto font-semibold">
            Discover the rich heritage, stunning temples, scenic hill stations, and vibrant cities of Tamil Nadu. 
            We provide comfortable taxi services to all these amazing destinations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 border-2 border-yellow-300"
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
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-yellow-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed font-semibold">
                  {destination.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-700 font-semibold">
                    <MapPin className="w-4 h-4 mr-2 text-black" />
                    <span>{destination.distance}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 font-semibold">
                    <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                    <span>{destination.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {destination.highlights.map((highlight, highlightIndex) => (
                    <span 
                      key={highlightIndex}
                      className="px-2 py-1 bg-yellow-100 text-black text-xs rounded-full font-semibold"
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
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 font-bold flex items-center justify-center group"
                >
                  <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book Trip to {destination.name.split(',')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-8 max-w-4xl mx-auto border-2 border-yellow-300">
            <Star className="w-12 h-12 text-black mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-4">Plan Your Tamil Nadu Adventure</h3>
            <p className="text-gray-700 mb-6 leading-relaxed font-semibold">
              From ancient temples to scenic hill stations, Tamil Nadu offers incredible diversity. 
              Our experienced drivers know the best routes and can guide you to hidden gems along the way.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-black mb-1">50+</div>
                <div className="text-gray-700 font-semibold">Destinations Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black mb-1">1000+</div>
                <div className="text-gray-700 font-semibold">Happy Travelers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black mb-1">24/7</div>
                <div className="text-gray-700 font-semibold">Service Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TamilNaduDestinations;
