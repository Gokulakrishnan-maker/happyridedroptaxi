import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Car, User, Phone, Send, AlertCircle } from 'lucide-react';
import { BookingFormData, ValidationError, BookingResponse } from '../types/booking';
import LocationInput from './LocationInput';

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

  const carTypes = [
    { value: 'sedan', label: 'Sedan', price: '₹12/km', description: 'Comfortable for 4 passengers' },
    { value: 'suv', label: 'SUV', price: '₹15/km', description: 'Spacious for 6-7 passengers' },
    { value: 'etios', label: 'Etios', price: '₹10/km', description: 'Economic choice for 4 passengers' },
    { value: 'innova', label: 'Innova', price: '₹18/km', description: 'Premium comfort for 6-7 passengers' },
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
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Book Your Taxi</h2>
            <p className="text-gray-600 text-lg">Quick and easy online booking</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <LocationInput
                  label="Pickup Location"
                  value={formData.pickupLocation}
                  onChange={(value, coordinates) => {
                    handleInputChange('pickupLocation', value);
                    if (coordinates) {
                      setFormData(prev => ({ ...prev, pickupCoordinates: coordinates }));
                    }
                  }}
                  placeholder="Enter pickup location"
                  error={getFieldError('pickupLocation')}
                  icon={<MapPin className="inline w-4 h-4 mr-2 text-blue-600" />}
                />

                {/* Drop Location */}
                <LocationInput
                  label="Drop Location"
                  value={formData.dropLocation}
                  onChange={(value, coordinates) => {
                    handleInputChange('dropLocation', value);
                    if (coordinates) {
                      setFormData(prev => ({ ...prev, dropCoordinates: coordinates }));
                    }
                  }}
                  placeholder="Enter drop location"
                  error={getFieldError('dropLocation')}
                  icon={<MapPin className="inline w-4 h-4 mr-2 text-red-600" />}
                />

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
                        {car.label} ({car.price}) - {car.description}
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