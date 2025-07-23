'use client';

import { createContext, useContext, useState } from 'react';

const ColorThemeContext = createContext();

export const ColorThemeProvider = ({ children }) => {
  const [colors, setColors] = useState({
    bgColor: '#1e293b',
    accentColor: '#334155',
  });

  return (
    <ColorThemeContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => useContext(ColorThemeContext);
