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

  const updateFromClick = (x: number, y: number) => {
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
      setSelectingHour(false); // switch to minutes
    } else {
      let m = Math.round(angle / 6) % 60;
      setMinute(m);
    }
  };

  const rotation = selectingHour ? (hour % 12) * 30 - 90 : minute * 6 - 90;

  // Render clock numbers
  const renderNumbers = () => {
    return (selectingHour ? Array.from({ length: 12 }, (_, i) => i + 1) : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]).map(
      (num) => {
        const angle = (num * (selectingHour ? 30 : 6)) - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 100;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const selected = selectingHour ? hour === num : minute === num;
        return (
          <div
            key={num}
            onClick={() =>
              selectingHour ? setHour(num) : setMinute(num)
            }
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
              selected ? "text-blue-600 font-bold" : "text-gray-700"
            }`}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            {num.toString().padStart(2, "0")}
          </div>
        );
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-80 overflow-hidden">
        {/* Header */}
        <div className="bg-sky-500 p-4 flex justify-between items-center text-white">
          <div className="text-4xl font-bold">
            {hour.toString().padStart(2, "0")}:
            {minute.toString().padStart(2, "0")}
          </div>
          <div>
            <button
              onClick={() => setAmpm("AM")}
              className={`px-2 py-1 rounded ${
                ampm === "AM" ? "bg-white text-sky-500" : "opacity-70"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm("PM")}
              className={`ml-2 px-2 py-1 rounded ${
                ampm === "PM" ? "bg-white text-sky-500" : "opacity-70"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock */}
        <div className="relative w-64 h-64 mx-auto my-6 bg-gray-100 rounded-full"
          ref={clockRef}
          onClick={(e) => updateFromClick(e.clientX, e.clientY)}
        >
          {renderNumbers()}
          {/* Hand */}
          <div
            className="absolute bg-sky-500 w-1 origin-bottom"
            style={{
              height: selectingHour ? "70px" : "100px",
              left: "50%",
              top: "50%",
              transform: `translateX(-50%) translateY(-100%) rotate(${rotation}deg)`,
            }}
          />
          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-sky-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Buttons */}
        <div className="flex justify-between px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="text-sky-500 font-semibold"
          >
            CANCEL
          </button>
          <button
            onClick={handleOK}
            className="text-sky-500 font-semibold"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimePicker;
