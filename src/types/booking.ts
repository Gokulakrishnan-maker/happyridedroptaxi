export interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: 'one-way' | 'round-trip';
  date: string;
  time: string;
  carType: 'sedan' | 'suv' | 'etios' | 'innova';
  name: string;
  phone: string;
  distance?: number;
  estimatedDuration?: string;
  pickupCoordinates?: { lat: number; lng: number };
  dropCoordinates?: { lat: number; lng: number };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: any;
}