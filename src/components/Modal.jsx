import React, { useEffect } from "react";

const Modal = ({ isOpen, children, modal }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg p-6 w-full ${
          modal ? "max-w-4xl" : "max-w-lg"
        } text-[#074DA1]`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
