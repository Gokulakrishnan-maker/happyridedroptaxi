export interface BookingFormData {
  pickupLocation: string;
  dropLocation: string;
  tripType: 'one-way' | 'round-trip';
  date: string;
  time: string;
  carType: 'sedan' | 'suv' | 'etios' | 'innova';
  name: string;
  phone: string;
  email?: string;
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
  data?: {
    bookingId: string;
    estimatedDistance?: number;
    estimatedPrice?: string;
    whatsappLinks?: {
      admin: string;
      customer: string;
    };
    telegramLinks?: {
      admin: string;
      customer: string;
    };
  };
}

export interface NotificationData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  dropLocation: string;
  tripType: string;
  date: string;
  time: string;
  carType: string;
  distance: number;
  estimatedDuration?: string;
  estimatedPrice: string;
}