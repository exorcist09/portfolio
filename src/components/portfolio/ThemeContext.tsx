import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "dark" | "light";
export type Accent = "darkgreen" | "blue" | "cyan" | "violet";
export type CursorMode = "normal" | "magnifying" | "trail" | "invert" | "follower";

export const ACCENTS: Record<
  Accent,
  { name: string; swatch: string; primary: string; primaryFg: string; ring: string; glow: string }
> = {
  darkgreen: {
    name: "Light Green",
    swatch: "#4ade80",
    primary: "oklch(0.85 0.21 145)",
    primaryFg: "oklch(0.08 0.04 160)",
    ring: "oklch(0.85 0.21 145)",
    glow: "oklch(0.85 0.21 145 / 0.5)",
  },
  blue: {
    name: "Abyss Blue",
    swatch: "#3B82F6",
    primary: "#3B82F6",
    primaryFg: "#ffffff",
    ring: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  cyan: {
    name: "Plankton Cyan",
    swatch: "#22D3EE",
    primary: "#22D3EE",
    primaryFg: "#083344",
    ring: "#22D3EE",
    glow: "rgba(34, 211, 238, 0.5)",
  },
  violet: {
    name: "Deep Violet",
    swatch: "#8B5CF6",
    primary: "#8B5CF6",
    primaryFg: "#ffffff",
    ring: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.5)",
  },
};

type Ctx = {
  mode: Mode;
  accent: Accent;
  cursorMode: CursorMode;
  pufferEnabled: boolean;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setCursorMode: (c: CursorMode) => void;
  setPufferEnabled: (enabled: boolean) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [accent, setAccent] = useState<Accent>("darkgreen");
  const [cursorMode, setCursorMode] = useState<CursorMode>("normal");
  const [pufferEnabled, setPufferEnabledState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-puffer-enabled");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true;
  });

  const setPufferEnabled = (enabled: boolean) => {
    setPufferEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-puffer-enabled", String(enabled));
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(mode);
  }, [mode]);

  useEffect(() => {
    const a = ACCENTS[accent] || ACCENTS.darkgreen;
    const root = document.documentElement;
    root.style.setProperty("--primary", a.primary);
    root.style.setProperty("--primary-foreground", a.primaryFg);
    root.style.setProperty("--ring", a.ring);
    root.style.setProperty("--accent-glow", a.glow);
  }, [accent]);

  return (
    <ThemeCtx.Provider
      value={{
        mode,
        accent,
        cursorMode,
        pufferEnabled,
        setMode,
        setAccent,
        setCursorMode,
        setPufferEnabled,
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
