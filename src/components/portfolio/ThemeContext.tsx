import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "dark" | "light";
export type Accent = "orange" | "green" | "darkgreen" | "blue" | "purple";
export type CursorMode = "normal" | "magnifying" | "trail" | "invert" | "follower";

export const ACCENTS: Record<Accent, { name: string; swatch: string; primary: string; primaryFg: string; ring: string; glow: string }> = {
  orange: {
    name: "Orange",
    swatch: "#f97316",
    primary: "oklch(0.74 0.18 55)",
    primaryFg: "oklch(0.12 0.04 50)",
    ring: "oklch(0.74 0.18 55)",
    glow: "oklch(0.74 0.18 55 / 0.45)",
  },
  green: {
    name: "Green",
    swatch: "#22c55e",
    primary: "oklch(0.85 0.23 145)",
    primaryFg: "oklch(0.08 0.04 160)",
    ring: "oklch(0.85 0.23 145)",
    glow: "oklch(0.85 0.23 145 / 0.45)",
  },
  darkgreen: {
    name: "Dark Green",
    swatch: "#15803d",
    primary: "oklch(0.55 0.18 150)",
    primaryFg: "oklch(0.98 0.01 150)",
    ring: "oklch(0.55 0.18 150)",
    glow: "oklch(0.55 0.18 150 / 0.45)",
  },
  blue: {
    name: "Blue",
    swatch: "#3b82f6",
    primary: "oklch(0.72 0.18 250)",
    primaryFg: "oklch(0.12 0.04 250)",
    ring: "oklch(0.72 0.18 250)",
    glow: "oklch(0.72 0.18 250 / 0.45)",
  },
  purple: {
    name: "Purple",
    swatch: "#a855f7",
    primary: "oklch(0.72 0.21 305)",
    primaryFg: "oklch(0.12 0.05 305)",
    ring: "oklch(0.72 0.21 305)",
    glow: "oklch(0.72 0.21 305 / 0.45)",
  },
};

type Ctx = {
  mode: Mode;
  accent: Accent;
  cursorMode: CursorMode;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setCursorMode: (c: CursorMode) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [accent, setAccent] = useState<Accent>("green");
  const [cursorMode, setCursorMode] = useState<CursorMode>("normal");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(mode);
  }, [mode]);

  useEffect(() => {
    const a = ACCENTS[accent];
    const root = document.documentElement;
    root.style.setProperty("--primary", a.primary);
    root.style.setProperty("--primary-foreground", a.primaryFg);
    root.style.setProperty("--ring", a.ring);
    root.style.setProperty("--accent-glow", a.glow);
  }, [accent]);

  return <ThemeCtx.Provider value={{ mode, accent, cursorMode, setMode, setAccent, setCursorMode }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
