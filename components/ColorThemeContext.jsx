'use client';

import { createContext, useContext, useState } from 'react';

const ColorThemeContext = createContext();

export const ColorThemeProvider = ({ children }) => {
  const [colors, setColors] = useState({
    bgColor: '#4e293b',
    accentColor: '#a893c7',
  });

  return (
    <ColorThemeContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => useContext(ColorThemeContext);
