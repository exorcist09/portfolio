/**
 * Spider Animations & Procedural Kinematics
 */

export type SpiderState =
  | "spawning"
  | "descending"
  | "landing"
  | "idle"
  | "walking"
  | "climbing"
  | "falling"
  | "swinging"
  | "sleeping"
  | "greeting"
  | "thinking"
  | "excited"
  | "weaving";

export interface EyeState {
  lookX: number; // -1 (left), 0 (center), 1 (right)
  lookY: number; // -1 (up), 0 (center), 1 (down)
  isBlinking: boolean;
  isSleeping: boolean;
}

export interface LegRotations {
  l1: number; // front-left
  l2: number; // mid-front-left
  l3: number; // mid-back-left
  l4: number; // back-left
  r1: number; // front-right
  r2: number; // mid-front-right
  r3: number; // mid-back-right
  r4: number; // back-right
}

/**
 * Procedural leg rotation offsets by spider state and timestamp cycle
 */
export function calculateLegRotations(
  state: SpiderState,
  timeMs: number
): LegRotations {
  const t = timeMs / 1000;

  switch (state) {
    case "climbing": {
      // Physical vertical spider climb:
      // - Head is prominently at the top, body vertical.
      // - Front legs (L1, R1, L2, R2) reach HIGH UP overhead (30deg swing) to pull body up.
      // - Rear legs (L3, R3, L4, R4) push DOWNWARDS to propel body up.
      // - Alternating tetrapod gait (Phase A & B).
      const cycle = t * 8;
      const swingA = Math.sin(cycle) * 28;
      const swingB = Math.cos(cycle) * 28;

      return {
        // Left legs (clamping chatbox border on left)
        l1: 44 + swingA,          // Foreleg 1 reaches high UP (+16deg to +72deg)
        l2: 24 - swingB,          // Foreleg 2 reaches up
        l3: -28 + swingA * 0.6,   // Hindleg 1 braces down
        l4: -48 - swingB * 0.6,   // Hindleg 2 trails down

        // Right legs (outer legs pushing body up)
        r1: -44 - swingA,         // Foreleg 1 reaches high UP (-16deg to -72deg)
        r2: -24 + swingB,         // Foreleg 2 reaches up
        r3: 28 - swingA * 0.6,    // Hindleg 1 pushes down
        r4: 48 + swingB * 0.6,    // Hindleg 2 pushes down
      };
    }

    case "falling": {
      // Panicked leg flailing during mid-air freefall
      const flail1 = Math.sin(t * 26) * 32;
      const flail2 = Math.cos(t * 26) * 32;
      return {
        l1: 15 + flail1,
        l2: -15 - flail2,
        l3: -35 + flail1,
        l4: -55 - flail2,
        r1: -15 - flail1,
        r2: 15 + flail2,
        r3: 35 - flail1,
        r4: 55 + flail2,
      };
    }

    case "walking": {
      // Alternating crawl gait
      const walk1 = Math.sin(t * 8) * 12;
      const walk2 = Math.cos(t * 8) * 12;
      return {
        l1: walk1,
        l2: -walk2,
        l3: walk1,
        l4: -walk2,
        r1: -walk1,
        r2: walk2,
        r3: -walk1,
        r4: walk2,
      };
    }

    case "descending": {
      // Legs gently fluttering as spider slides down silk thread
      const paddle = Math.sin(t * 6) * 8;
      const paddleAlt = Math.cos(t * 6) * 8;
      return {
        l1: -8 + paddle,
        l2: -4 + paddleAlt,
        l3: 4 - paddle,
        l4: 8 - paddleAlt,
        r1: 8 - paddle,
        r2: 4 - paddleAlt,
        r3: -4 + paddle,
        r4: -8 + paddleAlt,
      };
    }

    case "greeting": {
      // Front-left leg waves enthusiastically
      const wave = Math.sin(t * 14) * 20;
      return {
        l1: -35 + wave,
        l2: -5,
        l3: 2,
        l4: 5,
        r1: 6,
        r2: 4,
        r3: 0,
        r4: 2,
      };
    }

    case "sleeping": {
      // Legs tucked in cozy and relaxed
      return {
        l1: 6,
        l2: 4,
        l3: -4,
        l4: -6,
        r1: -6,
        r2: -4,
        r3: 4,
        r4: 6,
      };
    }

    case "excited": {
      // All legs splayed outward and vibrating
      const shake = Math.sin(t * 16) * 8;
      return {
        l1: -14 + shake,
        l2: -8 - shake,
        l3: 8 + shake,
        l4: 14 - shake,
        r1: 14 - shake,
        r2: 8 + shake,
        r3: -8 - shake,
        r4: -14 + shake,
      };
    }

    case "thinking": {
      // Subtle tapping with front right leg
      const tap = Math.sin(t * 10) * 10;
      return {
        l1: -2,
        l2: 0,
        l3: 2,
        l4: 4,
        r1: 8 + tap,
        r2: 0,
        r3: -2,
        r4: -4,
      };
    }

    case "swinging": {
      const swingSway = Math.sin(t * 4) * 10;
      return {
        l1: swingSway * 0.8,
        l2: swingSway * 0.6,
        l3: -swingSway * 0.6,
        l4: -swingSway * 0.8,
        r1: swingSway * 0.8,
        r2: swingSway * 0.6,
        r3: -swingSway * 0.6,
        r4: -swingSway * 0.8,
      };
    }

    case "weaving": {
      // Deliberate cartoon silk-weaving kinematics:
      // - Rear legs (L4, R4) actively extend and pull silk strands from spinneret to web
      // - Mid legs (L2, R2, L3, R3) anchor and tilt body to adjust web tension
      // - Forelegs (L1, R1) rhythmically pat and guide the silk strands into place
      const cycle = t * 3.2; // slow, deliberate rhythmic pace
      const legPull = Math.sin(cycle) * 36;
      const legPullAlt = Math.cos(cycle) * 36;
      const guideWave = Math.sin(cycle * 0.7) * 16;
      return {
        l1: -14 + guideWave,
        l2: 4 - legPull * 0.25,
        l3: 16 + legPullAlt * 0.35,
        l4: 44 + legPull,      // Rear leg actively pulling and attaching silk
        r1: 14 - guideWave,
        r2: -4 + legPullAlt * 0.25,
        r3: -16 - legPull * 0.35,
        r4: -44 - legPullAlt,  // Rear leg actively pulling and attaching silk
      };
    }

    case "landing":
    case "spawning":
    case "idle":
    default: {
      // Static grounded posture (no constant leg flailing)
      return {
        l1: 0,
        l2: 0,
        l3: 0,
        l4: 0,
        r1: 0,
        r2: 0,
        r3: 0,
        r4: 0,
      };
    }
  }
}

/**
 * Convert relative mouse coordinates to discrete pixel eye directions (-1, 0, 1)
 */
export function calculateEyeTracking(
  spiderRect: DOMRect | null,
  mouseX: number,
  mouseY: number
): { lookX: number; lookY: number } {
  if (!spiderRect) return { lookX: 0, lookY: 0 };

  const spiderCenterX = spiderRect.left + spiderRect.width / 2;
  const spiderCenterY = spiderRect.top + spiderRect.height / 2;

  const dx = mouseX - spiderCenterX;
  const dy = mouseY - spiderCenterY;

  // Threshold in pixels to shift pupils
  const deadZone = 28;

  let lookX = 0;
  if (dx > deadZone) lookX = 1;
  else if (dx < -deadZone) lookX = -1;

  let lookY = 0;
  if (dy > deadZone) lookY = 1;
  else if (dy < -deadZone) lookY = -1;

  return { lookX, lookY };
}
