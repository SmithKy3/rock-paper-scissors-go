import React from 'react';

export interface DarkModeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface DarkModeContextProviderProps {
  children?: React.ReactNode;
}

const DARK_MODE_KEY = 'RPS-GO-darkModeEnabled';
const DARK_MODE_CLASS = 'dark';

const defaultDarkModeContext: DarkModeContext = {
  isDarkMode: false,
  toggleDarkMode: () => {},
};

export const darkModeContext = React.createContext<DarkModeContext>(
  defaultDarkModeContext
);

function applyDarkModeState(isDarkMode: boolean) {
  if (!document || !window) return;

  if (isDarkMode) {
    document.body.classList.add(DARK_MODE_CLASS);
  } else {
    document.body.classList.remove(DARK_MODE_CLASS);
  }

  window.localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkMode));
}

export const DarkModeContextProvider: React.FC<
  DarkModeContextProviderProps
> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode((currentValue) => {
      const valueToSet = !currentValue;
      applyDarkModeState(valueToSet);
      return valueToSet;
    });
  }, []);
  const getContextValue = React.useCallback<() => DarkModeContext>(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode, toggleDarkMode]
  );

  React.useEffect(() => {
    const storedDarkModeState = window.localStorage.getItem(DARK_MODE_KEY);
    const initialDarkModeState: boolean =
      storedDarkModeState && JSON.parse(storedDarkModeState);
    applyDarkModeState(initialDarkModeState);
    setIsDarkMode(initialDarkModeState);
  }, []);

  return (
    <darkModeContext.Provider value={getContextValue()}>
      {children}
    </darkModeContext.Provider>
  );
};

export const useDarkModeContext = () => React.useContext(darkModeContext);
