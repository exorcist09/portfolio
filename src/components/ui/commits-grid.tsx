"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export const CommitsGrid = ({
  text,
  username,
  className,
  colors = ["transparent", "#016d32", "#0d4429", "#48d55d", "#68e57d"],
  noBorders = false,
}: {
  text: string;
  username?: string;
  className?: string;
  colors?: string[];
  noBorders?: boolean;
}) => {
  const [githubData, setGithubData] = React.useState<
    Array<{ date: string; count: number; level: number }>
  >([]);
  const [showGithub, setShowGithub] = React.useState(false);

  React.useEffect(() => {
    if (!username) return;

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contributions) {
          setGithubData(data.contributions);
        }
      });

    const timer = setTimeout(() => {
      setShowGithub(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [username]);
  const cleanString = (str: string): string => {
    const upperStr = str.toUpperCase();

    const withoutAccents = upperStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const allowedChars = Object.keys(letterPatterns);
    return withoutAccents
      .split("")
      .filter((char) => allowedChars.includes(char))
      .join("");
  };

  const generateHighlightedCells = (text: string) => {
    const cleanedText = cleanString(text);
    const width = 53;
    const height = 7;
    const textWidth = cleanedText.length * 6;
    let currentPosition = Math.max(0, Math.floor((width - textWidth) / 2));

    const highlightedCells: number[] = [];

    cleanedText
      .toUpperCase()
      .split("")
      .forEach((char) => {
        if (letterPatterns[char]) {
          const pattern = letterPatterns[char].map((pos) => {
            const row = Math.floor(pos / 50);
            const col = pos % 50;
            return row * width + col + currentPosition;
          });
          highlightedCells.push(...pattern);
        }
        currentPosition += 6;
      });

    return {
      cells: highlightedCells,
      width,
      height,
    };
  };

  const {
    cells: highlightedCells,
    width: gridWidth,
    height: gridHeight,
  } = generateHighlightedCells(text);

  const githubCells = React.useMemo(() => {
    const cells = Array(53 * 7).fill(0);
    if (!githubData.length) return cells;

    githubData.forEach((day, i) => {
      const col = Math.floor(i / 7);
      const row = i % 7;
      if (col < 53 && row < 7) {
        cells[row * 53 + col] = day.level;
      }
    });
    return cells;
  }, [githubData]);

  const getRandomColor = () => {
    const activeColors = colors.slice(1);
    if (activeColors.length === 0) return colors[0];
    const randomIndex = Math.floor(Math.random() * activeColors.length);
    return activeColors[randomIndex];
  };

  const getRandomDelay = () => `${(Math.random() * 0.6).toFixed(1)}s`;
  const getRandomFlash = () => +(Math.random() < 0.3);

  return (
    <section
      className={cn(
        "w-full max-w-xl bg-card grid p-1.5 sm:p-3 gap-0.5 sm:gap-1",
        !noBorders && "border rounded-[10px] sm:rounded-[15px]",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridWidth * gridHeight }).map((_, index) => {
        const isGithubActive = showGithub && githubData.length > 0;

        if (isGithubActive) {
          const level = githubCells[index];
          const bgColor = level > 0 ? colors[Math.min(level, colors.length - 1)] : "transparent";
          return (
            <div
              key={index}
              className={cn(
                `h-full w-full aspect-square transition-all duration-1000`,
                !noBorders && "border rounded-[4px] sm:rounded-[3px]",
                noBorders && "rounded-[2px]",
                level === 0 && (noBorders ? "bg-foreground/5" : "bg-card"),
              )}
              style={{ backgroundColor: level > 0 ? bgColor : undefined }}
            />
          );
        }

        const isHighlighted = highlightedCells.includes(index);
        const shouldFlash = !isHighlighted && getRandomFlash();

        return (
          <div
            key={index}
            className={cn(
              `h-full w-full aspect-square transition-all duration-1000`,
              !noBorders && "border rounded-[4px] sm:rounded-[3px]",
              noBorders && "rounded-[2px]",
              isHighlighted ? "animate-highlight" : "",
              shouldFlash ? "animate-flash" : "",
              !isHighlighted && !shouldFlash ? (noBorders ? "bg-foreground/5" : "bg-card") : "",
            )}
            style={
              {
                animationDelay: getRandomDelay(),
                "--highlight": getRandomColor(),
              } as CSSProperties
            }
          />
        );
      })}
    </section>
  );
};

const letterPatterns: { [key: string]: number[] } = {
  A: [1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152, 153],
  B: [
    0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54, 104, 152, 153, 204,
    254, 303,
  ],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254, 303],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 204, 154, 304, 254],
  H: [0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254, 304],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 302, 300, 301],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 151, 152, 103, 54, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304],
  N: [0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204, 254, 304],
  Ñ: [0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 204, 254, 304],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 204, 202, 253, 304],
  R: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254, 304],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254, 303],
  X: [0, 50, 203, 254, 304, 4, 54, 152, 101, 103, 201, 250, 300],
  Y: [0, 50, 101, 152, 202, 252, 302, 4, 54, 103],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  "0": [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  "1": [1, 52, 102, 152, 202, 252, 302, 0, 2, 300, 301, 302, 303, 304],
  "2": [0, 1, 2, 3, 54, 104, 152, 153, 201, 250, 300, 301, 302, 303, 304],
  "3": [0, 1, 2, 3, 54, 104, 152, 153, 204, 254, 300, 301, 302, 303],
  "4": [0, 50, 100, 150, 4, 54, 104, 151, 152, 153, 154, 204, 254, 304],
  "5": [0, 1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  "6": [1, 2, 3, 50, 100, 150, 151, 152, 153, 200, 250, 301, 302, 204, 254, 303],
  "7": [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300],
  "8": [1, 2, 3, 50, 100, 151, 152, 153, 200, 250, 301, 302, 303, 54, 104, 204, 254],
  "9": [1, 2, 3, 50, 100, 151, 152, 153, 154, 204, 254, 304, 54, 104],
  " ": [],
};
