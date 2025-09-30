import React, { useState } from 'react';
import Select from 'react-select';
import { MapPin, Calendar, Clock, Car, User, Phone, Send, AlertCircle, Navigation, Mail } from 'lucide-react';
import { BookingFormData, ValidationError, BookingResponse } from '../types/booking';
import LocationInput from './LocationInput';
import { useDistanceCalculation } from '../hooks/useDistanceCalculation';
import AnalogClock from './AnalogClock';
import GoogleMapsLoader from './GoogleMapsLoader';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: '',
    dropLocation: '',
    tripType: 'one-way',
    date: '',
    time: '',
    carType: 'sedan',
    name: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number; lng: number} | null>(null);
  const [dropCoords, setDropCoords] = useState<{lat: number; lng: number} | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [showClock, setShowClock] = useState(false);

  const { calculateDistance, calculateHaversineDistance, isCalculating } = useDistanceCalculation();

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    if (!formData.pickupLocation.trim()) {
      newErrors.push({ field: 'pickupLocation', message: 'Pickup location is required' });
    }

    if (!formData.dropLocation.trim()) {
      newErrors.push({ field: 'dropLocation', message: 'Drop location is required' });
    }

    if (!formData.date) {
      newErrors.push({ field: 'date', message: 'Date is required' });
    }

    if (!formData.time) {
      newErrors.push({ field: 'time', message: 'Time is required' });
    }

    if (!formData.name.trim()) {
      newErrors.push({ field: 'name', message: 'Name is required' });
    }

    if (!formData.phone.trim()) {
      newErrors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.push({ field: 'phone', message: 'Please enter a valid 10-digit phone number' });
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Distance validation
    if (calculatedDistance) {
      const minDistance = formData.tripType === 'one-way' ? 130 : 250;
      if (calculatedDistance < minDistance) {
        newErrors.push({ 
          field: 'distance', 
          message: `Minimum distance for ${formData.tripType} trips is ${minDistance} km. Current distance: ${calculatedDistance} km` 
        });
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');

    try {
      const bookingData = {
        ...formData,
        distance: calculatedDistance,
        estimatedDuration,
        pickupCoordinates: pickupCoords,
        dropCoordinates: dropCoords
      };

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(`Booking submitted successfully! Booking ID: ${result.data.bookingId}. We will contact you shortly.`);
        
        // Auto-open WhatsApp for customer
        if (result.data.whatsappLinks?.customer) {
          setTimeout(() => {
            window.open(result.data.whatsappLinks.customer, '_blank');
          }, 2000);
        }
      } else {
        setSubmitMessage(result.message || 'Failed to submit booking. Please try again.');
      }
      
      // Reset form
      setFormData({
        pickupLocation: '',
        dropLocation: '',
        tripType: 'one-way',
        date: '',
        time: '',
        carType: 'sedan',
        name: '',
        phone: '',
        email: '',
      });
      setPickupCoords(null);
      setDropCoords(null);
      setCalculatedDistance(null);
      setEstimatedDuration('');
      
    } catch (error) {
      setSubmitMessage('Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleLocationChange = async (field: 'pickupLocation' | 'dropLocation', value: string, coords?: {lat: number; lng: number}) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'pickupLocation') {
      setPickupCoords(coords || null);
    } else {
      setDropCoords(coords || null);
    }
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
    
    // Calculate distance if both locations have coordinates (with updated coords)
    const updatedPickupCoords = field === 'pickupLocation' ? coords : pickupCoords;
    const updatedDropCoords = field === 'dropLocation' ? coords : dropCoords;
    
    if (updatedPickupCoords && updatedDropCoords) {
      try {
        const distance = await calculateDistance(updatedPickupCoords, updatedDropCoords);
        if (distance) {
          setCalculatedDistance(distance.distance);
          setEstimatedDuration(distance.duration);
        }
      } catch (error) {
        console.error('Error calculating distance:', error);
        // Fallback to Haversine calculation
        const fallbackDistance = calculateHaversineDistance(updatedPickupCoords, updatedDropCoords);
        setCalculatedDistance(fallbackDistance);
        setEstimatedDuration('Estimated');
      }
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find(err => err.field === fieldName);
    return error?.message;
  };

  // Updated car types with actual images
 const carTypes = [
  { value: 'sedan', label: 'Sedan', description: 'Comfortable for 4 passengers', image: '/cars/sedan.png' },
  { value: 'etios', label: 'Etios', description: 'Economic choice for 4 passengers', image: '/cars/etios.png' },
  { value: 'suv', label: 'SUV', description: 'Spacious for 6-7 passengers', image: '/cars/suv.png' },
  { value: 'innova', label: 'Innova', description: 'Premium comfort for 6-7 passengers', image: '/cars/innova.png' },
];


  // React-select options
  const carOptions = carTypes.map(car => ({
    value: car.value,
    label: car.label,
    description: car.description,
    image: car.image,
  }));

  const customOption = ({ innerProps, data }: any) => (
    <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
      <img src={data.image} alt={data.label} className="w-8 h-8 mr-2" />
      <div>
        <div className="font-semibold">{data.label}</div>
        <div className="text-sm text-gray-500">{data.description}</div>
      </div>
    </div>
  );

  const customSingleValue = ({ data }: any) => (
    <div className="flex items-center">
      <img src={data.image} alt={data.label} className="w-6 h-6 mr-2" />
      <span>{data.label}</span>
    </div>
  );

  // ... keep your validateForm, handleSubmit, handleInputChange, handleLocationChange, getFieldError as before

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-yellow-50 to-black/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Book Your Ride</h2>
            <p className="text-gray-700 text-lg font-semibold">Fill in the details below to book your taxi</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-yellow-400">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Fields */}
              <GoogleMapsLoader>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                  {/* Pickup Location */}
                  <LocationInput
                    id="pickup"
                    label="Pickup Location"
                    value={formData.pickupLocation}
                    onChange={(value, coords) => handleLocationChange('pickupLocation', value, coords)}
                    placeholder="Enter pickup location"
                    error={getFieldError('pickupLocation')}
                    icon={<MapPin className="inline w-4 h-4 mr-2 text-blue-600" />}
                  />

                  {/* Drop Location */}
                  <LocationInput
                    id="drop"
                    label="Drop Location"
                    value={formData.dropLocation}
                    onChange={(value, coords) => handleLocationChange('dropLocation', value, coords)}
                    placeholder="Enter drop location"
                    error={getFieldError('dropLocation')}
                    icon={<MapPin className="inline w-4 h-4 mr-2 text-emerald-600" />}
                  />
                  </div>
                </div>
              </GoogleMapsLoader>

              {/* Customer Details */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-300">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white ${
                        getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {getFieldError('name') && (
                      <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white ${
                        getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {getFieldError('email') && (
                      <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                    )}
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white ${
                        getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {getFieldError('phone') && (
                      <p className="text-red-500 text-sm mt-1">{getFieldError('phone')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Distance Information */}
              {(calculatedDistance || isCalculating) && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-black" />
                      <span className="font-semibold text-black">Distance Information</span>
                    </div>
                    {isCalculating && (
                      <div className="flex items-center space-x-2 text-black">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        <span className="text-sm">Calculating...</span>
                      </div>
                    )}
                  </div>
                  {calculatedDistance && (
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-black">Distance: </span>
                        <span className="font-semibold text-black">{calculatedDistance} km</span>
                      </div>
                      <div>
                        <span className="text-black">Duration: </span>
                        <span className="font-semibold text-black">{estimatedDuration}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trip Details */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-300">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Trip Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Navigation className="inline w-4 h-4 mr-2" />
                    Trip Type
                  </label>
                  <select
                    value={formData.tripType}
                    onChange={(e) => handleInputChange('tripType', e.target.value as 'one-way' | 'round-trip')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white"
                  >
                    <option value="one-way">One-way (Min 130 km)</option>
                    <option value="round-trip">Round-trip (Min 250 km)</option>
                  </select>
                </div>

                {/* Car Type with images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Car className="inline w-4 h-4 mr-2" />
                    Car Type
                  </label>
                  <Select
                    options={carOptions}
                    value={carOptions.find(opt => opt.value === formData.carType)}
                    onChange={(selected: any) => handleInputChange('carType', selected.value)}
                    components={{ Option: customOption, SingleValue: customSingleValue }}
                  />
                </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
                <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                      getFieldError('date') ? 'border-red-500' : 'border-gray-300'
                    } bg-white`}
                  />
                  {getFieldError('date') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('date')}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Time
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowClock(true)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-left ${
                      getFieldError('time') ? 'border-red-500' : 'border-gray-300'
                    } bg-white`}
                  >
                    {formData.time || 'Select time'}
                  </button>
                  {getFieldError('time') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError('time')}</p>
                  )}
                </div>
                </div>
              </div>

              {/* Distance Error */}
              {getFieldError('distance') && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {getFieldError('distance')}
                  </p>
                </div>
              )}

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg ${
                  submitMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Book Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analog Clock Modal */}
          {showClock && (
            <AnalogClock
              value={formData.time}
              onChange={(time) => handleInputChange('time', time)}
              onClose={() => setShowClock(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
