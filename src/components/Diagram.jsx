import React, { useState } from 'react';
import Modal from './Modal';

const Diagram = ({ photos, text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  const handleClick = (id) => {
    setSelectedPhotoId(id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPhotoId(null);
  };

  const selectedPhoto = photos[selectedPhotoId];

  return (
    <div className=" text-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-200">Objectives:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Diagram ${index}`}
            className="w-full h-auto rounded-lg cursor-pointer"
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <p className="text-lg text-teal-50">{text}</p>
      <Modal isOpen={isOpen} onClose={handleClose} photo={selectedPhoto} />
    </div>
  );
};

export default Diagram;
