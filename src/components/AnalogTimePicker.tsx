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
      setSelectingHour(false);
    } else {
      let m = Math.round(angle / 6) % 60;
      setMinute(m);
    }
  };

  const rotation = selectingHour ? (hour % 12) * 30 - 90 : minute * 6 - 90;

  const renderNumbers = () => {
    if (selectingHour) {
      return Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
        const angle = num * 30 - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 100;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const selected = hour === num;
        return (
          <div
            key={num}
            onClick={() => setHour(num)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
              selected ? "text-blue-600 font-bold" : "text-gray-700"
            }`}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            {num}
          </div>
        );
      });
    } else {
      return Array.from({ length: 60 }, (_, i) => i).map((num) => {
        const angle = num * 6 - 90;
        const rad = (angle * Math.PI) / 180;
        const radius = 100;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const selected = minute === num;
        return (
          <div
            key={num}
            onClick={() => setMinute(num)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
              selected ? "text-blue-600 font-bold" : num % 5 === 0 ? "text-gray-700" : "text-gray-400 text-xs"
            }`}
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            {num % 5 === 0 ? num.toString().padStart(2, "0") : "."}
          </div>
        );
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-80 overflow-hidden">
        {/* Header */}
        <div className="bg-sky-500 px-6 py-6 text-white flex justify-between items-center">
          <div className="flex text-4xl font-bold">
            <input
              type="number"
              value={hour}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val >= 1 && val <= 12) setHour(val);
              }}
              onClick={() => setSelectingHour(true)}
              className="w-14 text-center bg-transparent outline-none"
            />
            :
            <input
              type="number"
              value={minute}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val >= 0 && val < 60) setMinute(val);
              }}
              onClick={() => setSelectingHour(false)}
              className="w-14 text-center bg-transparent outline-none"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setAmpm("AM")}
              className={`px-3 py-1 text-lg font-medium rounded ${
                ampm === "AM" ? "bg-white text-sky-500" : "opacity-70"
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setAmpm("PM")}
              className={`px-3 py-1 text-lg font-medium rounded ${
                ampm === "PM" ? "bg-white text-sky-500" : "opacity-70"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock */}
        <div
          className="relative w-64 h-64 mx-auto my-6 bg-gray-100 rounded-full"
          ref={clockRef}
          onClick={(e) => updateFromClick(e.clientX, e.clientY)}
        >
          {renderNumbers()}
          <div
            className="absolute bg-sky-500 w-1 origin-bottom"
            style={{
              height: selectingHour ? "70px" : "100px",
              left: "50%",
              top: "50%",
              transform: `translateX(-50%) translateY(-100%) rotate(${rotation}deg)`,
            }}
          />
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
