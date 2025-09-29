import React, { useState, useRef, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

interface AnalogTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({ value, onChange, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
      setSelectedMinute(minutes);
      setAmpm(period as 'AM' | 'PM');
    }
  }, [value]);

  const handleClockClick = (event: React.MouseEvent) => {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    const angle = Math.atan2(y, x);
    const degrees = (angle * 180) / Math.PI + 90;
    const normalizedDegrees = degrees < 0 ? degrees + 360 : degrees;

    if (mode === 'hours') {
      const hour = Math.round(normalizedDegrees / 30);
      setSelectedHour(hour === 0 ? 12 : hour);
    } else {
      const minute = Math.round(normalizedDegrees / 6) * 5;
      setSelectedMinute(minute === 60 ? 0 : minute);
    }
  };

  const getHandRotation = () => {
    if (mode === 'hours') {
      return (selectedHour * 30) - 90;
    } else {
      return (selectedMinute * 6) - 90;
    }
  };

  const formatTime = () => {
    const hour = selectedHour.toString().padStart(2, '0');
    const minute = selectedMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${ampm}`;
  };

  const handleOK = () => {
    onChange(formatTime());
    onClose();
  };

  const renderNumbers = () => {
    if (mode === 'hours') {
      return Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        const angle = (hour * 30) - 90;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * 80;
        const y = Math.sin(radian) * 80;
        
        return (
          <div
            key={hour}
            className={`absolute w-8 h-8 flex items-center justify-center text-lg font-semibold transform -translate-x-1/2 -translate-y-1/2 ${
              selectedHour === hour ? 'text-blue-500' : 'text-gray-600'
            }`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            {hour}
          </div>
        );
      });
    } else {
      return Array.from({ length: 12 }, (_, i) => {
        const minute = i * 5;
        const displayMinute = minute.toString().padStart(2, '0');
        const angle = (minute * 6) - 90;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * 80;
        const y = Math.sin(radian) * 80;
        
        return (
          <div
            key={minute}
            className={`absolute w-8 h-8 flex items-center justify-center text-lg font-semibold transform -translate-x-1/2 -translate-y-1/2 ${
              selectedMinute === minute ? 'text-blue-500' : 'text-gray-600'
            }`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            {displayMinute}
          </div>
        );
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">Select Time</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 text-4xl font-bold">
            <button
              onClick={() => setMode('hours')}
              className={`px-2 py-1 rounded ${
                mode === 'hours' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
            >
              {selectedHour.toString().padStart(2, '0')}
            </button>
            <span className="text-gray-400">:</span>
            <button
              onClick={() => setMode('minutes')}
              className={`px-2 py-1 rounded border-2 ${
                mode === 'minutes' ? 'bg-blue-100 text-blue-600 border-blue-300' : 'text-gray-600 border-gray-300'
              }`}
            >
              {selectedMinute.toString().padStart(2, '0')}
            </button>
          </div>
          <div className="ml-4 flex flex-col space-y-1">
            <button
              onClick={() => setAmpm('AM')}
              className={`px-3 py-1 text-sm font-semibold rounded ${
                ampm === 'AM' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm('PM')}
              className={`px-3 py-1 text-sm font-semibold rounded ${
                ampm === 'PM' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Analog Clock */}
        <div className="flex justify-center mb-6">
          <div
            ref={clockRef}
            onClick={handleClockClick}
            className="relative w-64 h-64 bg-gray-100 rounded-full cursor-pointer shadow-inner"
          >
            {/* Clock Numbers */}
            {renderNumbers()}
            
            {/* Center Dot */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
            
            {/* Clock Hand */}
            <div
              className="absolute w-1 bg-blue-500 origin-bottom z-10"
              style={{
                height: '70px',
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-100%) rotate(${getHandRotation()}deg)`,
              }}
            ></div>
            
            {/* Selection Dot */}
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `calc(50% + ${Math.cos(((getHandRotation() + 90) * Math.PI) / 180) * 70}px)`,
                top: `calc(50% + ${Math.sin(((getHandRotation() + 90) * Math.PI) / 180) * 70}px)`,
              }}
            ></div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('hours')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                mode === 'hours' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Hours
            </button>
            <button
              onClick={() => setMode('minutes')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                mode === 'minutes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Minutes
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-blue-500 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleOK}
            className="px-6 py-2 text-blue-500 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;