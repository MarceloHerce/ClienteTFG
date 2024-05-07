import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Header() {
  const { jwt } = useContext(AppContext);

  return (
    <header>
      <h1>My App</h1>
      {jwt && <p>JWT: {jwt}</p>}
    </header>
  );
}

export default Header;