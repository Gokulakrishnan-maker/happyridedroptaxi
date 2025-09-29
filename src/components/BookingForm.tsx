import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Car, User, Phone, Send, AlertCircle, Navigation } from 'lucide-react';
import { BookingFormData, ValidationError, BookingResponse } from '../types/booking';
import LocationInput from './LocationInput';
import { useDistanceCalculation } from '../hooks/useDistanceCalculation';

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
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number; lng: number} | null>(null);
  const [dropCoords, setDropCoords] = useState<{lat: number; lng: number} | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');

  const { calculateDistance, calculateHaversineDistance, isCalculating } = useDistanceCalculation();

  const carTypes = [
    { value: 'sedan', label: 'Sedan', description: 'Comfortable for 4 passengers' },
    { value: 'suv', label: 'SUV', description: 'Spacious for 6-7 passengers' },
    { value: 'etios', label: 'Etios', description: 'Economic choice for 4 passengers' },
    { value: 'innova', label: 'Innova', description: 'Premium comfort for 6-7 passengers' },
  ];

  const validateForm = (): boolean => {
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
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }

    // Distance validation using calculated or estimated distance
    const distanceToCheck = calculatedDistance || (pickupCoords && dropCoords ? 
      calculateHaversineDistance(pickupCoords, dropCoords) : 0);
    
    if (formData.tripType === 'one-way' && distanceToCheck < 130) {
      newErrors.push({ field: 'distance', message: 'One-way trips require minimum 130 km distance' });
    }

    if (formData.tripType === 'round-trip' && distanceToCheck < 250) {
      newErrors.push({ field: 'distance', message: 'Round-trip bookings require minimum 250 km distance' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('Please fix the errors above and try again.');
      return;
    }

    setIsLoading(true);
    setSubmitMessage('');

    try {
      // Include distance information in the booking data
      const bookingDataWithDistance = {
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
        body: JSON.stringify(bookingDataWithDistance),
      });

      const result: BookingResponse = await response.json();

      if (result.success) {
        setSubmitMessage('Booking request submitted successfully! We will contact you shortly.');
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
        });
        setPickupCoords(null);
        setDropCoords(null);
        setCalculatedDistance(null);
        setEstimatedDuration('');
      } else {
        setSubmitMessage(result.message || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleLocationChange = async (
    field: 'pickupLocation' | 'dropLocation',
    value: string,
    coordinates?: { lat: number; lng: number }
  ) => {
    handleInputChange(field, value);
    
    if (field === 'pickupLocation') {
      setPickupCoords(coordinates || null);
    } else {
      setDropCoords(coordinates || null);
    }

    // Calculate distance when both locations are selected
    if (coordinates) {
      const otherCoords = field === 'pickupLocation' ? dropCoords : pickupCoords;
      const currentCoords = coordinates;
      
      if (otherCoords && currentCoords) {
        try {
          const result = await calculateDistance(
            field === 'pickupLocation' ? currentCoords : otherCoords,
            field === 'pickupLocation' ? otherCoords : currentCoords
          );
          setCalculatedDistance(result.distance);
          setEstimatedDuration(result.duration);
        } catch (error) {
          // Fallback to Haversine calculation
          const fallbackDistance = calculateHaversineDistance(
            field === 'pickupLocation' ? currentCoords : otherCoords,
            field === 'pickupLocation' ? otherCoords : currentCoords
          );
          setCalculatedDistance(fallbackDistance);
          setEstimatedDuration('Estimated');
        }
      }
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Book Your Ride</h2>
            <p className="text-gray-600 text-lg">Fill in the details below to book your taxi</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <LocationInput
                  label="Pickup Location"
                  value={formData.pickupLocation}
                  onChange={(value, coords) => handleLocationChange('pickupLocation', value, coords)}
                  placeholder="Enter pickup location"
                  error={getFieldError('pickupLocation')}
                  icon={<MapPin className="inline w-4 h-4 mr-2 text-blue-600" />}
                />

                {/* Drop Location */}
                <LocationInput
                  label="Drop Location"
                  value={formData.dropLocation}
                  onChange={(value, coords) => handleLocationChange('dropLocation', value, coords)}
                  placeholder="Enter drop location"
                  error={getFieldError('dropLocation')}
                  icon={<MapPin className="inline w-4 h-4 mr-2 text-emerald-600" />}
                />
              </div>

              {/* Distance Information */}
              {(calculatedDistance || isCalculating) && (
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Distance Information</span>
                    </div>
                    {isCalculating && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Calculating...</span>
                      </div>
                    )}
                  </div>
                  {calculatedDistance && (
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Distance: </span>
                        <span className="font-semibold text-gray-800">{calculatedDistance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration: </span>
                        <span className="font-semibold text-gray-800">{estimatedDuration}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">

                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trip Type
                  </label>
                  <select
                    value={formData.tripType}
                    onChange={(e) => handleInputChange('tripType', e.target.value as 'one-way' | 'round-trip')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="one-way">One-way (Min 130 km)</option>
                    <option value="round-trip">Round-trip (Min 250 km)</option>
                  </select>
                </div>

                {/* Car Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Car className="inline w-4 h-4 mr-2" />
                    Car Type
                  </label>
                  <select
                    value={formData.carType}
                    onChange={(e) => handleInputChange('carType', e.target.value as any)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {carTypes.map(car => (
                      <option key={car.value} value={car.value}>
                        {car.label} - {car.description}
                      </option>
                    ))}
                  </select>
                </div>

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
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      getFieldError('date') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('date') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getFieldError('date')}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      getFieldError('time') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('time') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getFieldError('time')}
                    </p>
                  )}
                </div>

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
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {getFieldError('name') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getFieldError('name')}
                    </p>
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
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      getFieldError('phone') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {getFieldError('phone') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getFieldError('phone')}
                    </p>
                  )}
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
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
        </div>
      </div>
    </section>
  );
};

export default BookingForm;