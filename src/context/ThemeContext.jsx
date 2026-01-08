import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. Priorité au choix manuel sauvegardé
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // 2. Sinon, on regarde la préférence système du téléphone
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Appliquer la classe 'dark' ou l'enlever
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Sauvegarder le choix
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Écouter les changements système (ex: passage automatique jour/nuit du téléphone)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // On ne change que si l'utilisateur n'a pas forcé un mode manuellement
      // (Optionnel : ici on force le changement pour suivre le système si pas de clic récent)
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);