import React, { useState, useRef, useEffect } from 'react';

interface AnalogTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({ value, onChange, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(5);
  const [selectedMinute, setSelectedMinute] = useState(29);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [mode, setMode] = useState<'hours' | 'minutes'>('minutes');
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
      const minute = Math.round(normalizedDegrees / 6);
      setSelectedMinute(minute === 60 ? 0 : minute);
    }
  };

  const getHandRotation = () => {
    if (mode === 'hours') {
      return selectedHour * 30 - 90;
    } else {
      return selectedMinute * 6 - 90;
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

  const renderMinuteNumbers = () => {
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    return minutes.map((minute) => {
      const angle = minute * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * 100;
      const y = Math.sin(rad) * 100;
      return (
        <div
          key={minute}
          className={`absolute text-md font-normal transform -translate-x-1/2 -translate-y-1/2 ${
            selectedMinute === minute ? 'text-blue-600 font-bold' : 'text-gray-600'
          }`}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {minute.toString().padStart(2, '0')}
        </div>
      );
    });
  };

  const renderHourNumbers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const angle = hour * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * 100;
      const y = Math.sin(rad) * 100;
      return (
        <div
          key={hour}
          className={`absolute text-md font-normal transform -translate-x-1/2 -translate-y-1/2 ${
            selectedHour === hour ? 'text-blue-600 font-bold' : 'text-gray-600'
          }`}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {hour}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-6xl font-light cursor-pointer ${
                  mode === 'hours' ? 'border-b-2 border-white' : ''
                }`}
                onClick={() => setMode('hours')}
              >
                {selectedHour.toString().padStart(2, '0')}
              </span>
              <span className="text-6xl font-light">:</span>
              <span
                className={`text-6xl font-light cursor-pointer ${
                  mode === 'minutes' ? 'border-b-2 border-white' : ''
                }`}
                onClick={() => setMode('minutes')}
              >
                {selectedMinute.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setAmpm('AM')}
                className={`px-3 py-2 text-lg font-medium rounded ${
                  ampm === 'AM' ? 'bg-white text-blue-500' : 'text-white opacity-60'
                }`}
              >
                AM
              </button>
              <button
                onClick={() => setAmpm('PM')}
                className={`px-3 py-2 text-lg font-medium rounded ${
                  ampm === 'PM' ? 'bg-white text-blue-500' : 'text-white opacity-60'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div className="p-8 bg-gray-100">
          <div
            ref={clockRef}
            onClick={handleClockClick}
            className="relative w-80 h-80 rounded-full cursor-pointer mx-auto"
            style={{ backgroundColor: '#ececec' }}
          >
            {mode === 'minutes' ? renderMinuteNumbers() : renderHourNumbers()}

            {/* Center Pivot */}
            <div
              className="absolute rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ width: '12px', height: '12px', backgroundColor: 'white', border: '3px solid #3b82f6' }}
            ></div>

            {/* Clock Hand */}
            <div
              className="absolute bg-blue-500 origin-bottom z-10"
              style={{
                width: '2px',
                height: '120px',
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-100%) rotate(${getHandRotation()}deg)`,
              }}
            ></div>

            {/* Selection Dot */}
            <div
              className="absolute bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                width: '20px',
                height: '20px',
                border: '4px solid white',
                left: `calc(50% + ${Math.cos(((getHandRotation() + 90) * Math.PI) / 180) * 120}px)`,
                top: `calc(50% + ${Math.sin(((getHandRotation() + 90) * Math.PI) / 180) * 120}px)`,
              }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 bg-white">
          <button onClick={onClose} className="text-blue-500 font-semibold text-lg hover:bg-blue-50 px-4 py-2 rounded transition-colors">
            CANCEL
          </button>
          <button onClick={HandleOK} className="text-blue-500 font-semibold text-lg hover:bg-blue-50 px-4 py-2 rounded transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;
