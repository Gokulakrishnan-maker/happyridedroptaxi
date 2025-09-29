import React from 'react';
import { Phone } from 'lucide-react';

const PhoneButton: React.FC = () => {
  const handlePhoneClick = () => {
    window.open('tel:+919087520500', '_self');
  };

  return (
    <button
      onClick={handlePhoneClick}
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse border-2 border-white"
      aria-label="Call us"
    >
      <Phone className="w-6 h-6" />
    </button>
  );
};

export default PhoneButton;