// useDatePicker.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { parseDateFromInput } from "./parseDate";

/**
 * Détermine si l'année passée en paramètre est une année bissextile
 * en vérifiant les divisions par 400, 100 et 4
 */
const isLeapYear = (year: number) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

/**
 * Vérifie si le jour, le mois et l'année donnés correspondent
 * à une date valide en utilisant le tableau daysInMonth
 */
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

/**
 * Hook principal qui initialise et gère l'état d'un sélecteur de date,
 * notamment l'ouverture du panneau, la date sélectionnée, et les fonctions
 * de formatage et de validation associées
 */
export const useDatePicker = ({
  initialValue,
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) => {
  // État contrôlant l'ouverture du sélecteur
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Transforme un objet Date en chaîne de caractères au format JJ/MM/AAAA
   */
  const formatDisplayDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  }, []);

  /**
   * Transforme un objet Date en chaîne de caractères au format AAAA-MM-JJ
   */
  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  /**
   * Convertit un input de type JJ/MM/AAAA en objet Date valide
   * ou renvoie null si la date est invalide
   */
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

  // Détermine la date initiale si fournie
  const initialDate = initialValue ? new Date(initialValue) : null;

  // Contient la valeur texte du champ date et la date sélectionnée
  const [inputValue, setInputValue] = useState<string>(
    initialDate ? formatDisplayDate(initialDate) : ""
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  // Contrôle le mois affiché dans le calendrier
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate || new Date()
  );

  // Référence pour détecter le clic en dehors du sélecteur
  const datepickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Surveille les clics en dehors du composant,
     * ferme le sélecteur si l'utilisateur clique à l'extérieur
     */
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

  /**
   * Inverse la valeur booléenne isOpen pour ouvrir/fermer le sélecteur
   */
  const toggleDatepicker = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Met à jour la valeur du champ texte et tente de convertir
   * l'entrée en date valide pour ajuster l'état
   */
  const handleInputChange = useCallback(
    (input: string) => {
      if (input.trim().length === 0) {
        setInputValue("");
        setSelectedDate(null);
        if (onChange) onChange("");
        return;
      }

      const formattedInput = parseDateFromInput(input);

      setInputValue(formattedInput);

      const digits = formattedInput.replace(/\D/g, "");
      if (digits.length === 8) {
        const date = parseInputDate(formattedInput);
        if (date) {
          setSelectedDate(date);
          setCurrentMonth(date);
          if (onChange) onChange(formatDate(date));
        } else {
          setSelectedDate(null);
          setInputValue("");
          if (onChange) onChange("");
        }
      } else {
        setSelectedDate(null);
        if (onChange) onChange("");
      }
    },
    [onChange, parseInputDate, formatDate]
  );

  /**
   * Affecte la date choisie par l'utilisateur comme date sélectionnée,
   * met à jour le champ texte et referme le sélecteur
   */
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

  /**
   * Calcule le jour de la semaine (0 = lundi) pour correctement aligner
   * les jours sur le calendrier
   */
  const getWeekDay = useCallback((date: Date) => {
    return (date.getDay() + 6) % 7;
  }, []);

  /**
   * Construit la liste de tous les jours à afficher dans
   * le calendrier pour le mois en cours (incluant les jours
   * du mois précédent/suivant visibles au début/à la fin)
   */
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

  /**
   * Bascule vers le mois précédent en ajustant le currentMonth
   */
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }, [currentMonth]);

  /**
   * Bascule vers le mois suivant en ajustant le currentMonth
   */
  const goToNextMonth = useCallback(() => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }, [currentMonth]);

  // Expose les valeurs et fonctions nécessaires pour le sélecteur
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
