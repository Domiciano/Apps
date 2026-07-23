import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { light, dark } from './colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Leer preferencia guardada en localStorage o default a 'dark'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

  const theme = useMemo(() => (mode === 'dark' ? dark : light), [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(mode);
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext); 