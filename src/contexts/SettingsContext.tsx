import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SettingsCtx {
  darkMode: boolean;
  toggleDarkMode: () => void;
  textOnly: boolean;
  toggleTextOnly: () => void;
}

const Ctx = createContext<SettingsCtx>({ darkMode: true, toggleDarkMode: () => {}, textOnly: false, toggleTextOnly: () => {} });

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("foras-dark") !== "false");
  const [textOnly, setTextOnly] = useState(() => localStorage.getItem("foras-textonly") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
    localStorage.setItem("foras-dark", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("foras-textonly", String(textOnly));
  }, [textOnly]);

  return (
    <Ctx.Provider value={{
      darkMode,
      toggleDarkMode: () => setDarkMode(v => !v),
      textOnly,
      toggleTextOnly: () => setTextOnly(v => !v),
    }}>{children}</Ctx.Provider>
  );
};

export const useSettings = () => useContext(Ctx);
