// useDatePicker.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { parseDateFromInput } from "./parseDate";

interface UseDatePickerProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const isLeapYear = (year: number) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

const validateDate = (day: number, month: number, year: number) => {
  if (year < 1 || month < 0 || month > 11 || day < 1) return false;

  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (day > daysInMonth[month]) {
    return false;
  }

  return true;
};

export const useDatePicker = ({
  initialValue,
  onChange,
}: UseDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDisplayDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }, []);

  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const parseInputDate = useCallback((input: string): Date | null => {
    const parts = input.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (!validateDate(day, month, year)) {
      return null;
    }

    const date = new Date(year, month, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }, []);

  const initialDate = initialValue ? new Date(initialValue) : null;

  const [inputValue, setInputValue] = useState<string>(
    initialDate ? formatDisplayDate(initialDate) : ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );

  const datepickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDatepicker = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleInputChange = useCallback(
    (input: string) => {
      // Si l'entrée est vide, on reset
      if (input.trim().length === 0) {
        setInputValue("");
        setSelectedDate(null);
        if (onChange) onChange("");
        return;
      }

      const formattedInput = parseDateFromInput(input);

      setInputValue(formattedInput);

      // Si on a la longueur complète (JJ/MM/AAAA)
      const digits = formattedInput.replace(/\D/g, "");
      if (digits.length === 8) {
        // Tenter de parse la date complète si possible
        const date = parseInputDate(formattedInput);
        if (date) {
          setSelectedDate(date);
          setCurrentMonth(date);
          if (onChange) onChange(formatDate(date));
        } else {
          // Date invalide, on réinitialise
          setSelectedDate(null);
          setInputValue("");
          if (onChange) onChange("");
        }
      } else {
        // Pas encore 8 chiffres, on ne valide pas encore
        setSelectedDate(null);
        if (onChange) onChange("");
      }
    },
    [onChange, parseInputDate, formatDate]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setInputValue(formatDisplayDate(date));
      setIsOpen(false);
      if (onChange) {
        onChange(formatDate(date));
      }
    },
    [onChange, formatDate, formatDisplayDate]
  );

  const getWeekDay = useCallback((date: Date) => {
    return (date.getDay() + 6) % 7; // Lundi = 0
  }, []);

  const renderDays = useCallback(() => {
    const days: JSX.Element[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(firstDayOfMonth.getDate() - getWeekDay(firstDayOfMonth));

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(
      lastDayOfMonth.getDate() + (6 - getWeekDay(lastDayOfMonth))
    );

    const date = new Date(startDate);

    while (date <= endDate) {
      const dateCopy = new Date(date);

      const isCurrentMonth = dateCopy.getMonth() === month;
      const isSelected =
        selectedDate &&
        dateCopy.getFullYear() === selectedDate.getFullYear() &&
        dateCopy.getMonth() === selectedDate.getMonth() &&
        dateCopy.getDate() === selectedDate.getDate();

      days.push(
        <div
          key={dateCopy.toDateString()}
          className={`p-2 text-center cursor-pointer ${
            isSelected
              ? "bg-blue-500 text-white rounded-full"
              : !isCurrentMonth
              ? "text-gray-400"
              : "text-black hover:bg-gray-200 rounded-full cursor-pointer"
          }`}
          onClick={() => handleDateSelect(dateCopy)}
        >
          {dateCopy.getDate()}
        </div>
      );

      date.setDate(date.getDate() + 1);
    }

    return days;
  }, [currentMonth, selectedDate, getWeekDay, handleDateSelect]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }, [currentMonth]);

  return {
    isOpen,
    inputValue,
    selectedDate,
    currentMonth,
    datepickerRef,
    toggleDatepicker,
    handleInputChange,
    renderDays,
    goToPreviousMonth,
    goToNextMonth,
  };
};
