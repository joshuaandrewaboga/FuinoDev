"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
type ThemeProviderState = { theme: Theme; setTheme: (theme: Theme) => void };
const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "refine-ui-theme",
}: ThemeProviderProps) {
  const [theme, updateTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(
        theme === "system" ? (media.matches ? "dark" : "light") : theme
      );
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (next) => {
          try {
            localStorage.setItem(storageKey, next);
          } catch {
            /* Theme still works without persistence. */
          }
          updateTheme(next);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeProviderContext);
}
ThemeProvider.displayName = "ThemeProvider";
