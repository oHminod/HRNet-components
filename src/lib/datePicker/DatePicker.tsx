// DatePicker.tsx

/**
 * Composant principal qui encapsule l'affichage et la logique d'un sélecteur de date.
 * Il gère notamment la saisie de la date, l'ouverture du calendrier, les interactions
 * de sélection, et fournit un champ caché pour stocker la date au bon format.
 */
import { Calendar } from "lucide-react";
import { useRef, useCallback } from "react";
import { useDatePicker } from "./utils/useDatePicker";
import "../components.css";

interface DatePickerProps {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

/**
 * Composant fonctionnel réutilisable qui encapsule un champ de saisie,
 * un bouton d'ouverture du calendrier, et un panneau de calendrier.
 * Il utilise le hook useDatePicker pour gérer l'état et la logique
 * interne, notamment la date actuelle, sa sélection et son affichage.
 */
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
    selectionLocked,
    toggleDatepicker,
    handleInputChange,
    renderDays,
    goToPreviousMonth,
    goToNextMonth,
    formatDate,
    setSelectionLocked,
  } = useDatePicker({ initialValue: value, onChange });

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Gère l'événement de focus sur le champ de saisie. Sélectionne le contenu
   * du champ afin de faciliter la saisie. Vérrouille la sélection pour éviter
   * qu'elle ne soit partiellement modifiée.
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
    setSelectionLocked(true); // On verrouille la sélection au focus
  };

  /**
   * Gère l'événement de relâchement de la souris. Empêche la sélection partielle
   * du texte si l'état selectionLocked est actif.
   */
  const handleMouseUp = (event: React.MouseEvent<HTMLInputElement>) => {
    // Empêcher la sélection partielle à la souris en annulant le mouseup si locked
    if (selectionLocked) {
      event.preventDefault();
    }
  };

  /**
   * Fonction chargée de maintenir la sélection complète si le verrou est actif
   * (c'est-à-dire si la saisie est considérée comme entièrement sélectionnée).
   */
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

  return (
    <div className="relative inline-block w-44" ref={datepickerRef}>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          className="border-2 border-r-1 p-2 rounded-l-lg px-4 w-full focus:outline-none hover:bg-gray-100 placeholder:text-gray-600 border-gray-400"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onMouseUp={handleMouseUp}
          onSelect={handleSelect}
          id={name + "-display"}
          name={name + "-display"}
        />
        <button
          type="button"
          onClick={toggleDatepicker}
          className="border-2 border-l-0 p-2 rounded-r-lg focus:outline-none hover:bg-gray-100 border-gray-400 text-gray-400 hover:text-gray-600"
          aria-label="Toggle Datepicker"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
      {isOpen && (
        <div className="fixed sm:absolute left-0 top-11 mt-1 z-10 w-screen sm:w-80 bg-white border-2 p-2 rounded-lg shadow">
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
          id={name}
          name={name}
          value={selectedDate ? formatDate(selectedDate) : ""}
        />
      )}
    </div>
  );
};

export default DatePicker;
