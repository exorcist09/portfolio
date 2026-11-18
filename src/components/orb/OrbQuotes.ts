/**
 * Orb's Interactive Dialogue Pool
 * Celestial, tech, and portfolio-oriented quips
 */

export const ORB_CLICK_QUOTES = [
  "Core synchronized.",
  "Orbiting Adarsh's portfolio.",
  "Double-click to open assistant!",
  "Axial tilt: 23.4°.",
  "Three.js + custom GLSL core.",
  "Energy frequency: optimal.",
  "Curious mind detected.",
  "Spinning at 60 FPS.",
  "Double-click to chat with AI.",
  "Exploring design + code.",
  "Plasma containment stable.",
  "Ask me anything — double click!",
];

export function getRandomOrbQuote(): string {
  const idx = Math.floor(Math.random() * ORB_CLICK_QUOTES.length);
  return ORB_CLICK_QUOTES[idx];
}
