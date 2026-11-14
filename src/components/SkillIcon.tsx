"use client";

import React from "react";

interface SkillIconProps {
  slug?: string;
  name?: string;
  className?: string;
}

export default function SkillIcon({
  slug = "",
  name = "",
  className = "w-3.5 h-3.5",
}: SkillIconProps) {
  const normalized = slug.toLowerCase().trim();

  // 1. Cursor: local uploaded asset /cursor.png
  if (normalized === "cursor") {
    return (
      <img
        src="/cursor.png"
        alt={name || "Cursor"}
        className={`${className} object-contain shrink-0`}
        loading="lazy"
      />
    );
  }

  // 2. Claude: local uploaded asset /claudecode.png
  if (normalized === "claude" || normalized === "anthropic") {
    return (
      <img
        src="/claudecode.png"
        alt={name || "Claude"}
        className={`${className} object-contain shrink-0`}
        loading="lazy"
      />
    );
  }

  // 3. AWS: local uploaded asset /aws.png
  if (normalized === "aws" || normalized === "amazonwebservices") {
    return (
      <img
        src="/aws.png"
        alt={name || "AWS"}
        className={`${className} object-contain shrink-0`}
        loading="lazy"
      />
    );
  }

  // 4. Java: Steaming coffee mug ("coffee dude")
  if (normalized === "java") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} text-white shrink-0`}
        aria-label="Java"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" />
        <line x1="10" y1="2" x2="10" y2="4" />
        <line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    );
  }

  // 5. Zustand: Authentic Zustand bear face
  if (normalized === "zustand") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${className} text-white shrink-0`}
        aria-label="Zustand"
      >
        <circle cx="6" cy="7" r="2.8" />
        <circle cx="18" cy="7" r="2.8" />
        <path d="M12 5c-4.4 0-7.8 3.5-7.8 8 0 4.1 3 7 7.8 7s7.8-2.9 7.8-7c0-4.5-3.4-8-7.8-8z" />
        <ellipse cx="12" cy="15" rx="3.5" ry="2.5" fill="#0E0E0E" />
        <circle cx="9" cy="11.5" r="1" fill="#0E0E0E" />
        <circle cx="15" cy="11.5" r="1" fill="#0E0E0E" />
        <ellipse cx="12" cy="14" rx="1.5" ry="1" fill="currentColor" />
      </svg>
    );
  }

  // 6. Agentic AI: Autonomous agent bot
  if (normalized === "agentic-ai" || normalized === "dependabot") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} text-white shrink-0`}
        aria-label="Agentic AI"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    );
  }

  // 7. WebSockets
  if (normalized === "websockets" || normalized === "socketdotio") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} text-white shrink-0`}
        aria-label="WebSockets"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
        <circle cx="12" cy="19" r="1" fill="currentColor" />
      </svg>
    );
  }

  // 8. HTML5 / CSS3
  if (normalized === "html5") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${className} text-white shrink-0`}
        aria-label="HTML5"
      >
        <path d="M3 2l1.6 18 7.4 2 7.4-2L21 2H3zm14.6 6.3h-7l.2 2.2h6.6l-.6 6.3-4.8 1.3-4.8-1.3-.3-3.6h2.2l.2 1.9 2.7.7 2.7-.7.3-3.1H7.8l-.6-6.1h10.7l-.3 2.4z" />
      </svg>
    );
  }

  // 9. Python: Pure white inline vector
  if (normalized === "python") {
    return (
      <svg
        viewBox="0 0 110 110"
        fill="currentColor"
        className={`${className} text-white shrink-0`}
        aria-label="Python"
      >
        <path d="M54.5 5.5c-27 0-25.3 11.7-25.3 11.7l.1 12.1h25.8v3.6H17.8C7 32.9 0 39.4 0 54.5c0 15 6.3 22.8 15.3 22.8h8.8v-12.7c0-14.7 12.8-15.3 15.3-15.3h25.7c2.6 0 15.3-.6 15.3-15.3V17.2S81.5 5.5 54.5 5.5zM41.7 13.7a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6z" />
        <path d="M55.5 104.5c27 0 25.3-11.7 25.3-11.7l-.1-12.1H54.9v-3.6h37.3c10.8 0 17.8-6.5 17.8-21.6 0-15-6.3-22.8-15.3-22.8h-8.8v12.7c0 14.7-12.8 15.3-15.3 15.3H44.9c-2.6 0-15.3.6-15.3 15.3v16.9s-1.1 11.7 25.9 11.7zm12.8-8.2a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z" />
      </svg>
    );
  }

  if (!normalized) {
    return <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />;
  }

  // Default: SimpleIcons pure white SVG
  return (
    <img
      src={`https://cdn.simpleicons.org/${normalized}/ffffff`}
      alt={name}
      className={`${className} object-contain brightness-0 invert opacity-90 shrink-0`}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/${normalized}`;
        (e.target as HTMLImageElement).classList.add("brightness-0", "invert");
      }}
    />
  );
}
