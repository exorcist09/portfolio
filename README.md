# Adarsh — Personal Portfolio

A dark-mode, high-craft personal portfolio built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, matching the referenced minimalist design aesthetic.

---

## ✨ Features & Visual Details

1. **Loader:**
   - Big cursive "Adarsh" lettering centered on pure black screen.
   - Smooth left-to-right fill animation with a glowing amber accent underline before unveiling the page.

2. **Top Bar:**
   - Minimal transparent top bar with "Adarsh" centered.
   - Smooth-scrolls back to top on click.

3. **Dock Navigation:**
   - **Desktop (Right-side Vertical Dock):**
     - Fixed to the extreme right edge, vertically centered.
     - Appears after scrolling past the Hero section (`fade + slide-in` from the right).
     - Translucent glass buttons with hover tooltips (`Home`, `Projects`, `Experience`, `Contact`, `GitHub`, `LinkedIn`, `Connect`, `Resume`).
     - Real-time `IntersectionObserver` active section indicator.
     - "Connect" copies email with a live feedback badge; "Resume" triggers download.
   - **Mobile (Bottom Floating Dock):**
     - Floating frosted glass horizontal pill at the bottom of the viewport.

4. **Section 1: Hero / About:**
   - Top metadata row: weather temperature (`☁ 24°C`) on left, live clock (`HH:MM:SS AM/PM GMT+5:30`) on right.
   - Rounded-square avatar with subtle border.
   - Role and bio paragraphs with bold off-white keywords and inline badges/emojis (`⚡`, `🧪`, `🇮🇳`).
   - "Talk to agent" interactive modal button + resume icon button.
   - Global keyboard shortcut: **Press `C` to copy email** to clipboard.

5. **Section 2: Work / Projects (Folder Cards):**
   - 2 large featured projects + compact secondary projects.
   - Light pastel cards (`#FFFFFF`, `#EDF5ED`, `#FFFBF2`, `#FFF4F2`) standing out on the dark page.
   - **Folder hover animation:** the front card tilts with 3D spring dynamics, revealing a colored sheet behind it angled at 10° with `"CLICK TO READ"` written vertically.
   - Pixel-font titles (`font-pixel` / Silkscreen / Pixelify Sans).

6. **Section 3: Experience & Education (List + Drag Timeline):**
   - Top-right toggle pill: `list` | `timeline`.
   - Handwritten `"try this \"` annotation with a curved yellow arrow pointing to the switch.
   - **List View:** Vertical connecting line, square logo tiles (current position features an active pulsating green dot), expandable accordion with amber asterisks (`*`) on highlights.
   - **Timeline View:** Horizontal drag-to-scroll timeline (2018–2027) with subtle year columns, top golden ambient bar, stacked lanes, short-stint tiles, and a dashed amber vertical `"now"` marker.
   - Handwritten footer note: `"drag sideways, the last 8 years are in here"`.

7. **Section 4: Stack / Tools:**
   - Monospace label `STACK`, heading `"what I make things with"`.
   - Categories: `DESIGN` and `MUSIC & AUDIO`.
   - Rounded-square grayscale icon tiles with hover brightening and tooltips.
   - Handwritten `"+ more"` at the end of each group.

8. **Section 5: Contact & Type-Erase Wordmark:**
   - Giant centered wordmark `@Adarsh`.
   - When scrolled into view, it erases letter-by-letter (backspace effect with blinking cursor) and re-types itself into `@exorcist`.
   - Expandable interactive glass pills:
     - **Email pill:** expands on click with green text (`vermaadarsh1024@gmail.com`), copy button, and direct mailto arrow (`↗`).
     - **LinkedIn & GitHub pills:** expand with direct profile URLs.
   - Minimalist footer with location (`📍 BENGALURU, INDIA`), credits, and copyright `© 2026`.

---

## 🛠️ How to Edit Content

All your personal details, projects, work history, and tools are centralized in `src/data/`:

| File | What to Customize |
|---|---|
| [`src/data/content.ts`](file:///src/data/content.ts) | Name, role, handle, alternate handle, bio text, email, social URLs, time zone, weather |
| [`src/data/projects.ts`](file:///src/data/projects.ts) | Project titles, tags, pastel card colors, flap colors, URLs, and preview styles |
| [`src/data/experience.ts`](file:///src/data/experience.ts) | Company names, roles, year spans (for timeline), bullet points, and logo badges |
| [`src/data/skills.ts`](file:///src/data/skills.ts) | Tools, categories, icons, and tooltip labels |

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build

# Start production server
npm run start
# or
bun run start
```
