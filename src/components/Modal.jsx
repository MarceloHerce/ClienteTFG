import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, photo }) => {
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }

    return () => {
      body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" text-white p-4 rounded-lg  relative max-w-fit md:max-w-lg lg:max-w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-teal-200 text-2xl h-1/6 p-2"
          >
            &times;
          </button>
        </div>
        <img src={photo} alt="Enlarged Diagram" className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
};

export default Modal;
