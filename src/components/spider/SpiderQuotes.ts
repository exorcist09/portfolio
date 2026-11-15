/**
 * Spidy's Interactive Dialogue Pool
 * Click responses categorized by context:
 * - First click greetings
 * - Developer-related jokes
 * - Repeated clicking reactions
 * - Random contextual quips
 */

export const FIRST_CLICK_GREETINGS = [
  "Psst... you called?",
  "Hey! What's crawling?",
  "Oh, hi there!",
  "You found me!",
  "Need a hand? I've got eight.",
  "Welcome to my little corner!",
  "Caught you looking!",
];

export const DEV_JOKES = [
  "I'm a web developer too. Literally.",
  "Just hanging around in the frontend.",
  "Weaving some clean code!",
  "Caught a bug. Not my dinner though.",
  "Eight legs, zero bugs in production.",
  "I make websites. One web at a time.",
  "Currently debugging my web.",
];

export const REPEATED_CLICKS = [
  "Again? I like the attention.",
  "Easy! I'm just a little spider.",
  "Are we playing click-the-spider?",
  "My legs are getting tired!",
  "Okay, okay. I'm awake!",
];

export const RANDOM_THINGS = [
  "Psst... check out the projects!",
  "Someone's scrolling a lot!",
  "Nice choice of theme.",
  "It's dark in here. I like it.",
  "I'm watching your cursor.",
  "Should I weave you something?",
  "Don't mind me. Just vibing.",
];

/**
 * Smart quote picker based on click frequency & interaction history
 */
export function getSpidyClickQuote(
  totalClicks: number,
  rapidClickStreak: number
): string {
  // If clicked repeatedly in short succession (streak >= 3)
  if (rapidClickStreak >= 3) {
    const idx = Math.floor(Math.random() * REPEATED_CLICKS.length);
    return REPEATED_CLICKS[idx];
  }

  // Very first click
  if (totalClicks <= 1) {
    const idx = Math.floor(Math.random() * FIRST_CLICK_GREETINGS.length);
    return FIRST_CLICK_GREETINGS[idx];
  }

  // Alternate between Dev Jokes and Random Spidy lines
  const pool = totalClicks % 2 === 0 ? DEV_JOKES : RANDOM_THINGS;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
