import React, { useState, useRef, useEffect } from "react";
import { Clock, X } from "lucide-react";

interface AnalogClockProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [isAM, setIsAM] = useState(true);
  const [isSelectingHour, setIsSelectingHour] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  // Initialize from existing value
  useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      if (time && period) {
        const [hours, minutes] = time.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
          setSelectedMinute(minutes);
          setIsAM(period === "AM");
        }
      }
    }
  }, [value]);

  const handleClockClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clockRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    // Calculate angle from center
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    // Adjust so 12 o'clock is 0 degrees
    angle = (angle + 90 + 360) % 360;

    if (isSelectingHour) {
      // Convert angle to hour (12 positions)
      const hour = Math.round(angle / 30) || 12;
      setSelectedHour(hour);
      // Auto-switch to minute selection after selecting hour
      setTimeout(() => setIsSelectingHour(false), 200);
    } else {
      // Convert angle to minute (60 positions, but snap to 5-minute intervals)
      const minute = Math.round(angle / 6);
      const snappedMinute = Math.round(minute / 5) * 5;
      setSelectedMinute(snappedMinute === 60 ? 0 : snappedMinute);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getHandStyle = () => {
    let angle: number;
    let length: string;

    if (isSelectingHour) {
      // Hour hand: 12 positions
      angle = ((selectedHour % 12) / 12) * 360 - 90;
      length = "70px";
    } else {
      // Minute hand: 60 positions
      angle = (selectedMinute / 60) * 360 - 90;
      length = "90px";
    }

    return {
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0% 50%",
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      width: length,
      height: "3px",
      backgroundColor: "#03A9F4",
      borderRadius: "2px",
      zIndex: 2,
    };
  };

  const getDotStyle = () => {
    let angle: number;
    let radius: number;

    if (isSelectingHour) {
      angle = ((selectedHour % 12) / 12) * 360 - 90;
      radius = 70;
    } else {
      angle = (selectedMinute / 60) * 360 - 90;
      radius = 90;
    }

    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      position: "absolute" as const,
      top: `calc(50% + ${y}px)`,
      left: `calc(50% + ${x}px)`,
      width: "12px",
      height: "12px",
      backgroundColor: "#03A9F4",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 3,
    };
  };

  const handleTimeSelect = () => {
    const timeString = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;
    onChange(timeString);
    onClose();
  };

  const renderClockNumbers = () => {
    if (isSelectingHour) {
      // Hour numbers (1-12)
      return Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        const angle = (hour / 12) * 360 - 90;
        const x = Math.cos((angle * Math.PI) / 180) * 85 + 128;
        const y = Math.sin((angle * Math.PI) / 180) * 85 + 128;
        
        return (
          <div
            key={hour}
            className="absolute text-lg font-semibold text-gray-700 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-500"
            style={{ left: x, top: y }}
            onClick={() => {
              setSelectedHour(hour);
              setTimeout(() => setIsSelectingHour(false), 200);
            }}
          >
            {hour}
          </div>
        );
      });
    } else {
      // Minute numbers (00, 05, 10, ..., 55)
      return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => {
        const angle = (minute / 60) * 360 - 90;
        const x = Math.cos((angle * Math.PI) / 180) * 100 + 128;
        const y = Math.sin((angle * Math.PI) / 180) * 100 + 128;
        
        return (
          <div
            key={minute}
            className="absolute text-sm font-semibold text-gray-700 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-500"
            style={{ left: x, top: y }}
            onClick={() => setSelectedMinute(minute)}
          >
            {minute.toString().padStart(2, "0")}
          </div>
        );
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header with time display */}
        <div className="bg-blue-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-6xl font-light">
            <button
              className={`px-2 py-1 rounded transition-colors ${
                isSelectingHour ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={() => setIsSelectingHour(true)}
            >
              {selectedHour.toString().padStart(2, "0")}
            </button>
            <span>:</span>
            <button
              className={`px-2 py-1 rounded border-2 transition-colors ${
                !isSelectingHour 
                  ? "border-white bg-white/20" 
                  : "border-transparent hover:bg-white/10"
              }`}
              onClick={() => setIsSelectingHour(false)}
            >
              {selectedMinute.toString().padStart(2, "0")}
            </button>
          </div>
          
          {/* AM/PM Toggle */}
          <div className="flex flex-col items-end absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-medium">
            <button
              onClick={() => setIsAM(true)}
              className={`px-2 py-1 rounded transition-colors ${
                isAM ? "bg-white/30 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setIsAM(false)}
              className={`px-2 py-1 rounded transition-colors ${
                !isAM ? "bg-white/30 text-white" : "text-white/70 hover:text-white"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock Face */}
        <div className="p-8 flex justify-center">
          <div
            ref={clockRef}
            className={`relative w-64 h-64 bg-gray-100 rounded-full cursor-pointer select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onClick={handleClockClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Clock Numbers */}
            {renderClockNumbers()}

            {/* Clock Hand */}
            <div style={getHandStyle()} />

            {/* Selection Dot */}
            <div style={getDotStyle()} />

            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleTimeSelect}
            className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;