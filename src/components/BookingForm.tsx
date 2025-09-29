import React, { useState } from 'react';
import Select from 'react-select';
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

                {/* Date, Time, Name, Phone ... keep your current inputs */}

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
