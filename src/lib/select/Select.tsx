// Select.tsx
import { useState, useRef, useEffect } from "react";

interface CustomSelectProps<T extends string | number> {
  options: T[];
  defaultValue?: T;
  placeholder?: string;
  name?: string;
  onOptionChange?: (value: T) => void;
}

const CustomSelect = <T extends string | number>({
  options,
  defaultValue,
  placeholder = "Select an option",
  name,
  onOptionChange,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value: T) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onOptionChange) {
      onOptionChange(value);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="border-2 p-2 rounded-lg cursor-pointer flex justify-between items-center px-4 py-2 hover:bg-gray-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={selectedValue !== undefined ? "" : "text-gray-400"}>
          {selectedValue !== undefined ? selectedValue : placeholder}
        </span>
        <svg
          className={`fill-current h-4 w-4 ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.516 7.548l4.484 4.484 4.484-4.484L15.484 9l-5 5-5-5z" />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border-2 p-2 rounded-lg shadow max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedValue === option ? "bg-gray-200" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            selectedValue !== undefined
              ? selectedValue
              : defaultValue !== undefined
              ? defaultValue
              : ""
          }
        />
      )}
    </div>
  );
};

export default CustomSelect;
