import React, { useState } from 'react';

const DarkLigthMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <button onClick={toggleDarkMode} className="mb-4 p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
        🔆
      </button>
      <div className="h-64 w-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 dark:from-blue-800 dark:via-green-800 dark:to-purple-800">
        {/* Contenido */}
      </div>
    </>
  );
};

export default DarkLigthMode;