import React, { useState, useRef, useEffect } from "react";

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
  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [selectingHour, setSelectingHour] = useState(true);
  const [dragging, setDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      const [h, m] = time.split(":").map(Number);
      setHour(h === 0 ? 12 : h > 12 ? h - 12 : h);
      setMinute(m);
      setAmpm(period as "AM" | "PM");
    }
  }, [value]);

  const formatTime = () => {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m} ${ampm}`;
  };

  const handleOK = () => {
    onChange(formatTime());
    onClose();
  };

  const updateFromPosition = (x: number, y: number) => {
    const rect = clockRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (selectingHour) {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      setHour(h);
      setSelectingHour(false);
    } else {
      let m = Math.round(angle / 6) % 60;
      setMinute(m);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    updateFromPosition(e.clientX, e.clientY);
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) updateFromPosition(e.clientX, e.clientY);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const hourRotation = (hour % 12) * 30 - 90;
  const minuteRotation = minute * 6 - 90;

  const renderHourNumbers = () =>
    Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = num * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const r = 100;
      const x = Math.cos(rad) * r;
      const y = Math.sin(rad) * r;
      return (
        <div
          key={num}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-gray-700 font-medium text-lg"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {num}
        </div>
      );
    });

  const renderMinuteNumbers = () =>
    Array.from({ length: 12 }, (_, i) => {
      const num = i * 5;
      const angle = num * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const r = 100;
      const x = Math.cos(rad) * r;
      const y = Math.sin(rad) * r;
      return (
        <div
          key={num}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-gray-700 font-medium text-lg"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {num.toString().padStart(2, "0")}
        </div>
      );
    });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-80 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 px-6 py-6 text-white flex justify-between items-center">
          <div className="text-5xl font-light flex items-center">
            <span
              className={`cursor-pointer transition-colors ${
                selectingHour ? "text-white" : "text-white/70"
              }`}
              onClick={() => setSelectingHour(true)}
            >
              {hour.toString().padStart(2, "0")}
            </span>
            <span className="mx-2">:</span>
            <span
              className={`cursor-pointer transition-colors border-2 px-2 py-1 rounded ${
                !selectingHour 
                  ? "text-white border-white" 
                  : "text-white/70 border-transparent"
              }`}
              onClick={() => setSelectingHour(false)}
            >
              {minute.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-col text-lg font-medium">
            <button
              onClick={() => setAmpm("AM")}
              className={`py-1 px-2 rounded transition-colors ${
                ampm === "AM" 
                  ? "text-white bg-white/20" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm("PM")}
              className={`py-1 px-2 rounded transition-colors ${
                ampm === "PM" 
                  ? "text-white bg-white/20" 
                  : "text-white/70 hover:text-white"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock */}
        <div className="p-6 flex justify-center bg-gray-50">
          <div
            ref={clockRef}
            onMouseDown={handleMouseDown}
            onClick={(e) => updateFromPosition(e.clientX, e.clientY)}
            className="relative w-64 h-64 bg-gray-200 rounded-full cursor-pointer shadow-inner"
          >
            {selectingHour ? renderHourNumbers() : renderMinuteNumbers()}

            {/* Clock Hand */}
            <div
              className="absolute bg-blue-500 origin-bottom rounded-full"
              style={{
                width: "3px",
                height: selectingHour ? "80px" : "100px",
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(-100%) rotate(${
                  selectingHour ? hourRotation : minuteRotation
                }deg)`,
              }}
            />
            
            {/* Clock Hand Dot */}
            <div 
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${
                  Math.cos(((selectingHour ? hourRotation : minuteRotation) + 90) * Math.PI / 180) * (selectingHour ? 80 : 100)
                }px, ${
                  Math.sin(((selectingHour ? hourRotation : minuteRotation) + 90) * Math.PI / 180) * (selectingHour ? 80 : 100)
                }px)`
              }}
            />
            
            {/* Center Dot */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="text-blue-500 font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleOK}
            className="text-blue-500 font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;