# Aura Styling & Design Guide

Welcome to the **Aura** design system. This document outlines the core styling principles, color palettes, typography, and UI patterns used throughout the application. Adhering to these guidelines ensures a cohesive and premium user experience.

---

## 🎨 The "Aura" Aesthetic
The Aura aesthetic is characterized by:
- **Clean & Modern**: High whitespace, minimal borders, and crisp typography.
- **Glassmorphism**: Use of semi-transparent backgrounds with backdrop blurs (`.glass-card`).
- **Luminous Accents**: Subtle "glow" effects and "orbs" that create depth and visual interest (`.glow-orb`).
- **Nature-Inspired Palette**: Focus on "Mint" greens and soft "Ink" blacks.

---

## 🌈 Color Palette
We use **OKLCH** colors for better perceptual uniformity and vibrant results.

### Core Colors
| Category | Variable | OKLCH Value | Description |
| :--- | :--- | :--- | :--- |
| **Background** | `--background` | `oklch(0.995 0 0)` | Near-white, soft background. |
| **Foreground** | `--foreground` | `oklch(0.16 0 0)` | "Ink" black for text and primary elements. |
| **Primary** | `--primary` | `oklch(0.16 0 0)` | Same as foreground (Ink). |
| **Mint (Accent)** | `--mint` | `oklch(0.88 0.2 150)` | Vibrant green for highlights and CTAs. |
| **Mint Soft** | `--mint-soft` | `oklch(0.95 0.08 150)` | Backgrounds for badges or soft accents. |
| **Border** | `--border` | `oklch(0.93 0.005 250)` | Subtle, light borders. |

### Gradients
- **CTA Gradient**: `linear-gradient(110deg, #000 0%, #0a0a0a 45%, #1bbf5a 100%)`
  - Used for high-impact buttons and primary actions.

---

## ✍️ Typography
- **Primary Font**: [Outfit](https://fonts.google.com/specimen/Outfit)
- **Scale**:
  - `text-xs`: Tiny labels / secondary info.
  - `text-sm`: Body text / form labels.
  - `text-base`: Default reading text.
  - `text-lg/xl`: Section headers.
  - `text-4xl/7xl`: Hero titles and display text.
- **Rules**:
  - Use `font-bold` (700) or `font-semibold` (600) for headings.
  - Use `antialiased` for better rendering on macOS/Webkit.
  - Apply `text-balance` for headers to avoid awkward line breaks.

---

## 🧩 Key UI Components & Utilities

### 1. Page Layout (`PageShell.tsx`)
Always wrap main page content in the `<PageShell />` component.
- **Includes**: Fixed background glow orbs and standard container padding.
- **Container**: `max-w-7xl` with responsive padding (`px-5` to `px-10`).

### 2. Glassmorphism (`.glass-card`)
Used for cards, sidebars, and overlays.
- **Style**: `oklch(1 0 0 / 0.7)` background + `backdrop-blur(20px)`.
- **Border**: `1px solid var(--border)`.

### 3. Glow Orbs (`.glow-orb`)
Background decorative elements.
- **Style**: Radial gradient from mint-glow to transparent with a heavy blur.
- **Usage**: See `GlowBackground.tsx` for positioning examples.

### 4. Primary Buttons (`.btn-cta`)
High-emphasis actions.
- **Style**: Uses `gradient-cta` with a soft lift and glow on hover.

---

## 📐 Layout & Spacing
- **Border Radius**: Base radius is `1rem` (`16px`).
  - `radius-lg`: `1rem`
  - `radius-xl`: `1.25rem`
- **Spacing Scale**: Follow standard Tailwind spacing (4px increments).
- **Shadows**:
  - `shadow-soft`: Subtle depth for standard cards.
  - `shadow-glow`: Used for "active" or "luminous" states.

---

## 🛠 Developer Best Practices
1. **Use Shadcn UI**: Start with the existing UI components in `src/components/ui/`. They are pre-configured with the theme.
2. **Stick to OKLCH**: When adding custom colors, use OKLCH to match the existing palette's vibrance and clarity.
3. **Avoid Pure Black/White**: Use the defined `--background` and `--foreground` (Ink) variables for a softer, more professional look.
4. **Mobile First**: All layouts must be responsive. Use Tailwind's `md:`, `lg:` prefixes.
5. **Interactive Feedback**: Ensure all clickable elements have hover/active states (e.g., opacity changes, scale shifts, or glow effects).

---

*Last Updated: June 2026*
