// modal.tsx
import { CircleX } from "lucide-react";
import "../components.css";

const Modal = ({
  title,
  message,
  setIsOpenModal,
}: {
  title: string;
  message: string;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={() => setIsOpenModal(false)}
      ></div>
      <div
        className="bg-white p-4 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <p>{message}</p>
        <button
          className="absolute -top-[12px] -right-[12px] bg-white rounded-full p-1"
          onClick={() => setIsOpenModal(false)}
        >
          <CircleX />
        </button>
      </div>
    </div>
  );
};

export default Modal;
