import React, { useState, useRef, useEffect } from "react";

interface AnalogTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose: () => void;
}

const AnalogTimePicker: React.FC<AnalogTimePickerProps> = ({
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

  // Hour numbers (1–12)
  const renderHourNumbers = () =>
    Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const angle = num * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const r = 90;
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

  // Minute numbers (00, 05, …, 55)
  const renderMinuteNumbers = () =>
    Array.from({ length: 12 }, (_, i) => {
      const num = i * 5;
      const angle = num * 6 - 90;
      const rad = (angle * Math.PI) / 180;
      const r = 90;
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
        <div className="bg-sky-500 px-6 py-6 text-white flex justify-between items-center">
          <div className="flex items-center text-5xl font-light">
            <span
              className={`cursor-pointer ${
                selectingHour ? "text-white" : "opacity-70"
              }`}
              onClick={() => setSelectingHour(true)}
            >
              {hour}
            </span>
            <span className="mx-2">:</span>
            <span
              className={`cursor-pointer border-2 px-2 py-1 rounded ${
                !selectingHour ? "border-white text-white" : "border-transparent opacity-70"
              }`}
              onClick={() => setSelectingHour(false)}
            >
              {minute.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-col text-lg ml-4">
            <button
              onClick={() => setAmpm("AM")}
              className={`px-2 py-1 rounded ${
                ampm === "AM" ? "bg-white text-sky-500 font-semibold" : "text-white opacity-70"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm("PM")}
              className={`px-2 py-1 rounded mt-1 ${
                ampm === "PM" ? "bg-white text-sky-500 font-semibold" : "text-white opacity-70"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock */}
        <div className="p-8 flex justify-center">
          <div
            ref={clockRef}
            onMouseDown={handleMouseDown}
            onClick={(e) => updateFromPosition(e.clientX, e.clientY)}
            className="relative w-64 h-64 bg-gray-200 rounded-full cursor-pointer"
          >
            {selectingHour ? renderHourNumbers() : renderMinuteNumbers()}

            {/* Clock Hand */}
            <div
              className="absolute bg-sky-500 origin-bottom rounded-full"
              style={{
                width: "3px",
                height: selectingHour ? "70px" : "80px",
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(-100%) rotate(${
                  selectingHour ? hourRotation : minuteRotation
                }deg)`,
              }}
            />
            
            {/* Clock Hand Dot */}
            <div 
              className="absolute bg-sky-500 rounded-full"
              style={{
                width: "12px",
                height: "12px",
                left: "50%",
                top: "50%",
                transform: `translateX(-50%) translateY(-50%) translate(${
                  Math.cos(((selectingHour ? hourRotation : minuteRotation) + 90) * Math.PI / 180) * (selectingHour ? 70 : 80)
                }px, ${
                  Math.sin(((selectingHour ? hourRotation : minuteRotation) + 90) * Math.PI / 180) * (selectingHour ? 70 : 80)
                }px)`,
              }}
            />
            
            {/* Center Dot */}
            <div className="absolute w-4 h-4 bg-sky-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="text-sky-500 font-semibold text-lg hover:text-sky-600 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleOK}
            className="text-sky-500 font-semibold text-lg hover:text-sky-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;