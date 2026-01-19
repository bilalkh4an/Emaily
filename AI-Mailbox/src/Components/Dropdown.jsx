import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const Dropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-1.5 shadow-sm bg-white cursor-pointer hover:bg-gray-50 z-30"
      >
        <span className="text-[14px] font-bold text-gray-700 flex-1">{value}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-10 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold hover:bg-blue-50 text-gray-700"
              >
                {opt} {value === opt && <Check size={16} className="text-blue-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
