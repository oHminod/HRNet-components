// DatePicker.tsx
import { Calendar } from "lucide-react";
import { useRef, useCallback, useState } from "react";
import { useDatePicker } from "./utils/useDatePicker";

interface DatePickerProps {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const DatePicker = ({
  name,
  value,
  placeholder = "jj/mm/aaaa",
  onChange,
}: DatePickerProps) => {
  const {
    isOpen,
    inputValue,
    selectedDate,
    currentMonth,
    datepickerRef,
    toggleDatepicker,
    handleInputChange: originalHandleInputChange,
    renderDays,
    goToPreviousMonth,
    goToNextMonth,
  } = useDatePicker({ initialValue: value, onChange });

  const inputRef = useRef<HTMLInputElement>(null);

  // Cet état servira à verrouiller la sélection.
  // true : la sélection complète est forcée au survol et clic initial.
  // false : dès que l'utilisateur tape, on le met à false et on n'applique plus la contrainte.
  const [selectionLocked, setSelectionLocked] = useState(true);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
    setSelectionLocked(true); // On verrouille la sélection au focus
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLInputElement>) => {
    // Empêcher la sélection partielle à la souris en annulant le mouseup si locked
    if (selectionLocked) {
      event.preventDefault();
    }
  };

  const handleSelect = useCallback(() => {
    // Si la sélection est verrouillée, on s'assure que tout est toujours sélectionné
    if (selectionLocked && inputRef.current) {
      const input = inputRef.current;
      const { selectionStart, selectionEnd, value } = input;
      if (selectionStart !== 0 || selectionEnd !== value.length) {
        input.select();
      }
    }
  }, [selectionLocked]);

  // Une fois que l'utilisateur tape, on libère le verrou, on le réactive quand la date est complète
  const handleInputChange = (val: string) => {
    if (val.length >= 10) setSelectionLocked(true);
    if (val.length < 10) setSelectionLocked(false);
    originalHandleInputChange(val);
  };

  return (
    <div className="relative inline-block w-44" ref={datepickerRef}>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          className="border-2 border-r-1 p-2 rounded-l-lg px-4 py-2 w-full focus:outline-none hover:bg-gray-100"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onMouseUp={handleMouseUp}
          onSelect={handleSelect}
        />
        <button
          type="button"
          onClick={toggleDatepicker}
          className="border-2 border-l-0 p-2 rounded-r-lg px-2 py-2 focus:outline-none hover:bg-gray-100"
        >
          <Calendar className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-80 bg-white border-2 p-2 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="px-2 py-1"
            >
              &#8592;
            </button>
            <span className="font-semibold">
              {currentMonth.toLocaleString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button type="button" onClick={goToNextMonth} className="px-2 py-1">
              &#8594;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day) => (
              <div key={day} className="text-center font-semibold">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>
      )}
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedDate ? formatDate(selectedDate) : ""}
        />
      )}
    </div>
  );
};

export default DatePicker;
