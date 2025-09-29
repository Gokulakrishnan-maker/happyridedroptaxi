import React, { useState, useRef, useEffect } from "react";

interface AnalogClockProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  value,
  onChange,
  placeholder = "Select Time",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [isSelectingHour, setIsSelectingHour] = useState(true); // 🔹 Step toggle

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      setSelectedHour(hours);
      setSelectedMinute(minutes);
      setIsAM(period === "AM");
      setIsSelectingHour(true);
    }
  }, [value]);

  const handleClockClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    if (isSelectingHour) {
      // Round to nearest hour
      let hour = Math.round(normalizedAngle / 30);
      if (hour === 0) hour = 12;
      setSelectedHour(hour);
      setIsSelectingHour(false); // 🔹 Move to minutes after selecting hour
    } else {
      // Round to nearest 5 minutes
      const minute = Math.round(normalizedAngle / 6) % 60;
      setSelectedMinute(minute);
    }
  };

  const getHandStyle = () => {
    const angle = isSelectingHour
      ? ((selectedHour ?? 12) / 12) * 360 - 90
      : (selectedMinute / 60) * 360 - 90;

    return {
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0% 50%",
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      width: isSelectingHour ? "80px" : "110px",
      height: "2px",
      backgroundColor: "#03A9F4",
    };
  };

  const handleTimeSelect = () => {
    if (selectedHour === null) return;

    const timeString = `${selectedHour
      .toString()
      .padStart(2, "0")}:${selectedMinute
      .toString()
      .padStart(2, "0")} ${isAM ? "AM" : "PM"}`;
    onChange(timeString);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg text-gray-900 border border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-400 cursor-pointer text-sm"
      >
        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
      </div>

      {/* Clock Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
            {/* Digital Time Header */}
            <div className="bg-sky-500 text-white p-4 flex items-center justify-center space-x-2 text-5xl font-bold">
              <button
                className={`${
                  isSelectingHour ? "text-black" : ""
                } px-1 rounded`}
                onClick={() => setIsSelectingHour(true)}
              >
                {selectedHour ?? "--"}
              </button>
              <span>:</span>
              <button
                className={`border-2 border-white rounded px-2 ${
                  !isSelectingHour ? "text-black" : ""
                }`}
                onClick={() => setIsSelectingHour(false)}
              >
                {selectedMinute.toString().padStart(2, "0")}
              </button>
              <div className="flex flex-col ml-3 text-base font-semibold">
                <button
                  onClick={() => setIsAM(true)}
                  className={`${isAM ? "text-black font-bold" : "text-white/70"}`}
                >
                  AM
                </button>
                <button
                  onClick={() => setIsAM(false)}
                  className={`${!isAM ? "text-black font-bold" : "text-white/70"}`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Analog Clock */}
            <div className="p-8 flex justify-center">
              <div
                className="relative w-64 h-64 bg-gray-100 rounded-full cursor-pointer"
                onClick={handleClockClick}
              >
                {isSelectingHour
                  ? // Hour numbers (1–12)
                    Array.from({ length: 12 }, (_, i) => {
                      const hour = i + 1;
                      const angle = (hour / 12) * 360 - 90;
                      const x =
                        Math.cos((angle * Math.PI) / 180) * 90 + 128;
                      const y =
                        Math.sin((angle * Math.PI) / 180) * 90 + 128;
                      return (
                        <div
                          key={hour}
                          className="absolute text-lg font-semibold text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: x, top: y }}
                        >
                          {hour}
                        </div>
                      );
                    })
                  : // Minute numbers (00,05,...55)
                    [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                      const angle = (m / 60) * 360 - 90;
                      const x =
                        Math.cos((angle * Math.PI) / 180) * 110 + 128;
                      const y =
                        Math.sin((angle * Math.PI) / 180) * 110 + 128;
                      return (
                        <div
                          key={m}
                          className="absolute text-sm font-semibold text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: x, top: y }}
                        >
                          {m.toString().padStart(2, "0")}
                        </div>
                      );
                    })}

                {/* Clock Hand */}
                <div style={getHandStyle()} />

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-sky-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between px-6 py-4 text-sky-500 font-bold">
              <button onClick={() => setIsOpen(false)}>CANCEL</button>
              <button onClick={handleTimeSelect}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalogClock;
