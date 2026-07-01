---
name: Cyber-Scholar RPG
colors:
  surface: '#12121d'
  surface-dim: '#12121d'
  surface-bright: '#383845'
  surface-container-lowest: '#0d0d18'
  surface-container-low: '#1b1a26'
  surface-container: '#1f1e2a'
  surface-container-high: '#292935'
  surface-container-highest: '#343440'
  on-surface: '#e3e0f1'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e3e0f1'
  inverse-on-surface: '#302f3b'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#007650'
  on-tertiary-container: '#76ffc2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#12121d'
  on-background: '#e3e0f1'
  surface-variant: '#343440'
  streak-orange: '#F97316'
  error-red: '#EF4444'
  glass-surface: rgba(255, 255, 255, 0.08)
  glass-border: rgba(255, 255, 255, 0.15)
  text-primary: '#F1F5F9'
  text-muted: '#94A3B8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  badge-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system establishes a **"Cyber-Scholar"** aesthetic—a fusion of high-stakes RPG adventure and professional educational discipline. It targets an ambitious Vietnamese demographic of students and young professionals who seek a high-octane, gamified experience to conquer the TOEIC exam.

The visual style is a sophisticated mix of **Glassmorphism** and **Cyberpunk Minimalism**. It utilizes deep, atmospheric backgrounds reminiscent of a futuristic nighttime city, overlaid with translucent panels that feel like high-tech holographic interfaces. The emotional response is one of "determined excitement"—transforming the solitary, often dry task of language learning into a heroic quest for knowledge and rank.

The UI avoids "kiddy" gamification, opting instead for sharp, neon-tinted accents and sleek, professional layouts that command respect and focus.

## Colors

The palette is anchored in a deep midnight foundation (`#0F0F1A`), allowing vibrant neon accents to define the interactive landscape. 

- **Primary Purple:** Represents the "Mana" of the system—progress, active energy, and the core brand identity.
- **Achievement Gold:** Reserved strictly for high-value rewards, ranks, and milestones to create a Pavlovian sense of accomplishment.
- **Success Green:** Used for correct answers and unlocked potential.
- **Streak Orange:** Ignites a sense of urgency and momentum.

The design utilizes **Glassmorphism** surfaces (`rgba(255, 255, 255, 0.08)`) to maintain depth without sacrificing the visibility of the atmospheric city background. Borders are subtle but sharp, using a higher opacity white to define the "edges" of the holographic UI.

## Typography

This design system uses **Inter** exclusively to maintain a professional, systematic feel that balances the "game" elements with educational legitimacy.

- **Display levels** are used for major ceremonies (Level Up, Victory) and should utilize a subtle outer glow when rendered in primary colors.
- **Body text** is optimized for readability in Vietnamese, maintaining a generous line height for quiz explanations.
- **Badge text** uses uppercase and increased letter spacing to provide a "technical interface" aesthetic for metadata like KP (Knowledge Points).

## Layout & Spacing

The layout is **mobile-first**, designed for one-handed navigation during daily commutes. It follows a **12-column fluid grid** on desktop/tablet, but collapses into a single-column layout for mobile with a standard 16px side margin.

The spacing rhythm is strictly based on a **4px unit**, creating a tight, engineered feel. Large panels (GlassPanels) should use 20px internal padding to ensure content doesn't feel cramped against the blurred edges. Vertical stacking of quiz options and lists follows the `md` (16px) spacing to ensure clear tap targets.

## Elevation & Depth

Depth is achieved through **translucency and stacking**, not traditional shadows. 

1.  **Background Layer:** A dynamic, slightly blurred video or image of a futuristic RPG city.
2.  **Base Glass Layer:** `blur(12px)` with a semi-transparent white fill. This is the standard surface for cards and content containers.
3.  **Floating Layer:** Elements like the `BottomNav` or `Popups` use a slightly higher opacity fill and a `0 8px 32px rgba(0,0,0,0.4)` shadow to provide clear separation from the content below.
4.  **Glow Tiers:** Interactive elements (completed SkillNodes, active CTAs) utilize "Neon Glows"—colored outer shadows that match the element's primary color, simulating light emission.

## Shapes

The shape language is **"Rounded-Technical."** While the UI is futuristic, fully sharp corners are avoided to remain approachable. 

- **16px (rounded-lg):** Main GlassPanels and large containers.
- **12px (rounded-md):** Quiz options and content cards.
- **Pill-shaped:** All CTA Buttons and Streak Counters. This distinct shape identifies "Actionable" or "Highly Dynamic" elements versus static content containers.

## Components

### GlassPanel
The core container. Must have `backdrop-filter: blur(12px)` and a 1px solid border using `glass-border`. Use for all main content areas.

### CTAButton
Height is fixed at 52px. Pill-shaped. 
- **Primary:** Gradient from `#7C3AED` to a slightly lighter purple. Includes a 10px blur glow of the same color.
- **Secondary:** Transparent with a `primary-purple` border.

### QuizOption
A 12px rounded container. 
- **Default:** `glass-surface` with `glass-border`.
- **Selected:** Border changes to `primary-purple` with a `rgba(124, 58, 237, 0.3)` background fill.
- **Correct:** Border changes to `success-green` with a `rgba(16, 185, 129, 0.2)` fill and a small check icon.
- **Incorrect:** Border changes to `error-red` with a `rgba(239, 68, 68, 0.15)` fill.

### ProgressBar
A custom track with a linear gradient from `primary-purple` to `success-green`. The "cap" of the progress bar should have a slight glow to indicate active movement.

### SkillNode & StatRadar
SkillNodes are circular 48px elements. Locked nodes use `#374151` with 50% opacity. Unlocked/Completed nodes use `success-green` with an active outer glow. The StatRadar chart should use a semi-transparent purple fill for the area and gold for the vertex points.

### BottomNav
A persistent 64px height bar. Uses a more opaque glass effect to ensure icons (⚡, ⚔️, 📋) remain highly legible against changing backgrounds. Active icons should glow and scale up by 10%.