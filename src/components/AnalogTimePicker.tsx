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
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const [dragging, setDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  // Initialize time from prop
  useEffect(() => {
    if (value) {
      const [time, period] = value.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
      setSelectedMinute(minutes);
      setAmpm(period as 'AM' | 'PM');
    }
  }, [value]);

  // Convert selected hour/minute to rotation
  const getHandRotation = () => (mode === 'hours' ? selectedHour * 30 - 90 : selectedMinute * 6 - 90);

  const formatTime = () => {
    const hour = selectedHour.toString().padStart(2, '0');
    const minute = selectedMinute.toString().padStart(2, '0');
    return `${hour}:${minute} ${ampm}`;
  };

  const handleOK = () => {
    onChange(formatTime());
    onClose();
  };

  // Handle drag / click
  const updateTimeFromPosition = (x: number, y: number) => {
    const rect = clockRef.current!.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx);
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    if (mode === 'hours') {
      const hour = Math.round(degrees / 30) || 12;
      setSelectedHour(hour);
      setMode('minutes'); // automatically switch to minutes
    } else {
      const minute = Math.round(degrees / 6) % 60;
      setSelectedMinute(minute);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => setDragging(true);
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

  const renderNumbers = () => {
    const numbers = mode === 'hours' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i * 5);
    return numbers.map((num) => {
      const angle = (mode === 'hours' ? num * 30 : num * 6) - 90;
      const rad = (angle * Math.PI) / 180;
      const radius = 100;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      const isSelected = mode === 'hours' ? selectedHour === num : selectedMinute === num;
      return (
        <div
          key={num}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 font-medium ${isSelected ? 'text-blue-500 font-bold' : 'text-gray-600'}`}
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {mode === 'hours' ? num : num.toString().padStart(2, '0')}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-8 text-white flex justify-between items-center">
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-light">{selectedHour}</span>
            <span
              className={`text-3xl font-light px-3 py-1 rounded ${mode === 'minutes' ? 'bg-white bg-opacity-20 border-2 border-white' : ''}`}
              onClick={() => setMode('minutes')}
            >
              {selectedMinute.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setAmpm('AM')}
              className={`px-3 py-2 text-lg font-medium rounded ${ampm === 'AM' ? 'bg-white text-blue-500' : 'text-white opacity-60'}`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm('PM')}
              className={`px-3 py-2 text-lg font-medium rounded ${ampm === 'PM' ? 'bg-white text-blue-500' : 'text-white opacity-60'}`}
            >
              PM
            </button>
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
            {renderNumbers()}

            {/* Center */}
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"></div>

            {/* Hand */}
            <div
              className="absolute w-1 bg-blue-500 origin-bottom z-10 transition-transform"
              style={{
                height: '120px',
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-100%) rotate(${getHandRotation()}deg)`,
              }}
            />

            {/* Selection dot */}
            <div
              className="absolute w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `calc(50% + ${Math.cos(((getHandRotation() + 90) * Math.PI) / 180) * 120}px)`,
                top: `calc(50% + ${Math.sin(((getHandRotation() + 90) * Math.PI) / 180) * 120}px)`,
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
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
