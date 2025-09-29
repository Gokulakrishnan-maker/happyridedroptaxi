import React, { useState, useRef, useEffect } from 'react';

interface AnalogTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({ value, onChange, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const [dragging, setDragging] = useState(false);
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

  const formatTime = () => {
    const hour = selectedHour.toString().padStart(2, '0');
    const minute = selectedMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${ampm}`;
  };

  const handleOK = () => {
    onChange(formatTime());
    onClose();
  };

  const updateTimeFromPosition = (x: number, y: number) => {
    const rect = clockRef.current!.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let angle = Math.atan2(dy, dx);
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    // If near the center → pick hour, else minute
    if (distance < rect.width / 3) {
      const hour = Math.round(degrees / 30) || 12;
      setSelectedHour(hour);
    } else {
      const minute = Math.round(degrees / 6) % 60;
      setSelectedMinute(minute);
    }
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) updateTimeFromPosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  // Render numbers 1-12
  const renderHourNumbers = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      const angle = (hour * 30) - 90;
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * 100;
      const y = Math.sin(rad) * 100;
      const isSelected = selectedHour === hour;
      return (
        <div
          key={hour}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 font-medium ${isSelected ? 'text-blue-500 font-bold' : 'text-gray-600'}`}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {hour}
        </div>
      );
    });
  };

  // Render minute dots
  const renderMinuteDots = () => {
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const radius = 130;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      return (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${selectedMinute === i ? 'bg-blue-500' : 'bg-gray-400'}`}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        />
      );
    });
  };

  const hourRotation = (selectedHour % 12) * 30 + selectedMinute / 2 - 90;
  const minuteRotation = selectedMinute * 6 - 90;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-6 text-white flex justify-between items-center">
          <div className="text-4xl font-light">{`${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`}</div>
          <div className="flex flex-col space-y-2">
            <button onClick={() => setAmpm('AM')} className={`px-3 py-2 text-lg font-medium rounded ${ampm === 'AM' ? 'bg-white text-blue-500' : 'text-white opacity-60'}`}>AM</button>
            <button onClick={() => setAmpm('PM')} className={`px-3 py-2 text-lg font-medium rounded ${ampm === 'PM' ? 'bg-white text-blue-500' : 'text-white opacity-60'}`}>PM</button>
          </div>
        </div>

        {/* Clock */}
        <div className="p-8 bg-gray-100">
          <div
            ref={clockRef}
            onMouseDown={handleMouseDown}
            onClick={(e) => updateTimeFromPosition(e.clientX, e.clientY)}
            className="relative w-80 h-80 bg-gray-200 rounded-full cursor-pointer mx-auto"
          >
            {renderHourNumbers()}
            {renderMinuteDots()}

            {/* Hour Hand */}
            <div
              className="absolute w-2 bg-blue-500 origin-bottom z-10 transition-transform"
              style={{
                height: '70px',
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-100%) rotate(${hourRotation}deg)`,
              }}
            />

            {/* Minute Hand */}
            <div
              className="absolute w-1 bg-blue-700 origin-bottom z-10 transition-transform"
              style={{
                height: '110px',
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-100%) rotate(${minuteRotation}deg)`,
              }}
            />

            {/* Center Dot */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between p-6 bg-white">
          <button onClick={onClose} className="text-blue-500 font-semibold text-lg hover:bg-blue-50 px-4 py-2 rounded transition-colors">
            CANCEL
          </button>
          <button onClick={handleOK} className="text-blue-500 font-semibold text-lg hover:bg-blue-50 px-4 py-2 rounded transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;
