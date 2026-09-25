---
name: Cendekia PPLG Studio
colors:
  surface: '#fafafb'
  surface-dim: '#cbdbf5'
  surface-bright: '#fafafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8fafc'
  surface-container: '#f1f5f9'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0f172a'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777586'
  outline-variant: '#e2e8f0'
  surface-tint: '#4338ca'
  primary: '#4338ca'
  on-primary: '#ffffff'
  primary-container: '#3730a3'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#6366f1'
  on-tertiary: '#ffffff'
  tertiary-container: '#eef2ff'
  on-tertiary-container: '#3730a3'
  success: '#10b981'
  on-success: '#ffffff'
  success-container: '#ecfdf5'
  on-success-container: '#065f46'
  warning: '#f59e0b'
  on-warning: '#ffffff'
  warning-container: '#fffbeb'
  on-warning-container: '#92400e'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#fef2f2'
  on-error-container: '#991b1b'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#fafafb'
  on-background: '#0f172a'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system is crafted for high-performing vocational (SMK) and secondary school students preparing for technical certification and college entrance exams (TKA) in Software and Game Development (PPLG). The interface eliminates cognitive overload, instilling composure, intellectual rigor, and self-assurance under exam pressure.

The visual direction merges refined Nordic academic minimalism with modern developer workspace ergonomics:
- **Tone:** Methodical, focused, scholarly, yet unmistakably contemporary and welcoming.
- **Aesthetic Movement:** Modern Scholarly Minimalism with tactile micro-interactions. Crisp structural boundaries, controlled spatial density, deliberate typography, and high typographic contrast ensure sustained focus over long study sessions.
- **Atmosphere:** An uncluttered digital study terminal free of gamified hyper-stimulation, engineered to treat technical students as aspiring software engineers and computational thinkers.

## Colors

The palette leverages a focused academic baseline paired with high-clarity semantic indicators tailored for code examination and exam analytics. **All colors below map 1:1 to the tokens in the YAML frontmatter above — always reference the token name (e.g. `primary`, `success-container`) in code, never a raw hex value.**

### Functional Color Applications
- **Primary Canvas & Surfaces:** The root canvas uses token `surface` / `background` (`#FAFAFB`) to reduce glare during prolonged screen time. Standard cards, exam tiles, and interactive elements use `surface-container-lowest` (`#FFFFFF`). Secondary panels, navigation sidebars, and test matrices use `surface-container-low` (`#F8FAFC`) and `surface-container` (`#F1F5F9`).
- **Primary Indigo (token `primary`, `#4338CA` / hover `primary-container`, `#3730A3`):** Conveys academic authority and clarity. Used for primary calls-to-action, active question indices, completed milestones, and primary focus boundaries.
- **Secondary Slate (token `on-surface`, `#0F172A` / `on-surface-variant`):** Provides deep, high-contrast legibility for stem text, code block headers, and modal typography.
- **Accents & AI Intelligence (token `tertiary` / `tertiary-container`, `#EEF2FF` to `#6366F1`):** A dedicated indigo hue reserved exclusively for automated cognitive assistance ("Dijelaskan oleh AI"), hint reveal badges, and code synthesis highlights.
- **Semantic Feedback (TKA Assessment Scale):**
  - **Success / Mastered (token `success` / `success-container`, `#10B981` / `#ECFDF5`):** Correct answers, high accuracy gauges, and "Mudah" indicators.
  - **Warning / Review (token `warning` / `warning-container`, `#F59E0B` / `#FFFBEB`):** Flagged questions, bookmark markers, and "Sedang" tags.
  - **Destructive / Error (token `error` / `error-container`, `#EF4444` / `#FEF2F2`):** Incorrect attempts, timeout alerts, and "Sulit" markers.
- **Structural Outlines:** Clean, low-contrast divider lines in `outline-variant` (`#E2E8F0`) and `#CBD5E1`. Never deploy high-black solid outlines.

## Typography

The typographic system utilizes **Plus Jakarta Sans** for core instructional reading and **JetBrains Mono** for technical code constructs, syntax evaluations, and quantitative badges.

### Typographic Hierarchy Rules
- **Stem Questions (`body-lg`):** Rendered at 16px with a generous 26px line height in `on-surface` (`#0F172A`) to preserve read-through stability during timed problem sets.
- **Code Blocks & Syntax:** Always set in `code-block` (JetBrains Mono 13px/22px) inside a designated slate container (`#0F172A` background with `#E2E8F0` text, or `surface-container-low` background with `#334155` text depending on context mode).
- **Metadata & Performance Gauges (`label-sm`, `label-md`):** Monospace styling ensures fixed-width numbers in timer displays, score meters (e.g., `85/100`), and question navigation coordinates do not cause visual jitter during runtime updates.

## Layout & Spacing

The exam interface is anchored to a dual-pane asymmetric workspace optimized for split inspection (Question Context + Technical Answer Interface).

### Breakpoints & Layout Adaptations
- **Desktop (1024px+):** Fixed full-height test layout. Left primary pane (70% fluid) houses question content, technical diagrams, and multiple-choice options. Right sidebar (30% fixed width: 340px) maintains the Question Number Navigator Grid, countdown timer, and exam status index.
- **Tablet (768px – 1023px):** Collapses the question navigator into a sliding off-canvas drawer or top collapsible ribbon with horizontal scrolling.
- **Mobile (< 768px):** Single vertical flow. The Question Number Navigator moves into a persistent bottom sheet toggled via a sticky status footer.
- **Spatial Rhythm:** Strict 4px/8px incremental rhythm for internal padding and layout offsets (use `space-xs` through `space-xl` tokens only — never arbitrary padding values). Question option items use `space-md` internal padding with `space-sm` vertical separation.

## Elevation & Depth

Visual depth is conveyed through delicate, diffused shadows paired with clean boundary outlines (`outline-variant`), maintaining an uncluttered workspace.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Applied to the base canvas (`surface`, `#FAFAFB`) and inactive split view backgrounds.
- **Level 1 (Card / Container):** Applied to resting question cards, option lists, and navigator tiles. Border: `1px solid #E2E8F0`, Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Hover / Active Interactive):** Triggered when hovering answer items or active navigator buttons. Border: `1px solid #C7D2FE`, Shadow: `0 4px 6px -1px rgba(67, 56, 202, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Sticky Heads / Drawers / Modals):** Timer bar, bottom navigation sheet, and AI explanation reveal panels. Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.02)`.
- **AI Special Callout (Glow):** Explanatory panels ("Dijelaskan oleh AI") utilize a subtle localized border glow: `0 0 0 1px #A5B4FC, 0 4px 12px 0 rgba(99, 102, 241, 0.12)`.

## Shapes

The design system adopts a balanced roundedness model (`0.5rem` / `8px` baseline) conveying precision and warmth without lapsing into playful casualness.

- **Option Cards & Question Panels:** `rounded-lg` (`12px` to `16px`) to produce soft, contained focus boundaries.
- **Action Buttons & Form Controls:** `rounded-md` (`8px`) for compact structure.
- **Status Tags, Difficulty Badges & AI Indicator Chips:** Full pill geometry (`9999px`) to distinguish metadata from interactive square modules.
- **Question Navigator Tiles:** Uniform squares with `8px` roundedness to maintain clean alignment within multi-row grids.

## Components

### Buttons
- **Primary:** Background `primary` (`#4338CA`), foreground `on-primary` (`#FFFFFF`), hover `primary-container` (`#3730A3`), focus ring `2px #A5B4FC` with 2px offset. Padding: `10px 20px`, typography: `title-md`.
- **Secondary / Ghost:** Transparent background, text `#334155`, border `1px solid #CBD5E1`. Hover: `surface-container-low` background, text `on-surface`.
- **Destructive / Flag:** Background `error-container` (`#FEF2F2`), border `1px solid #FECACA`, text `#DC2626`.

### Difficulty Badges & Chips
- **Mudah:** Background `success-container` (`#ECFDF5`), text `on-success-container` (`#065F46`), border `1px solid #A7F3D0`. Shape: Pill. Monospace typography.
- **Sedang:** Background `warning-container` (`#FFFBEB`), text `on-warning-container` (`#92400E`), border `1px solid #FDE68A`. Shape: Pill. Monospace typography.
- **Sulit:** Background `error-container` (`#FEF2F2`), text `on-error-container` (`#991B1B`), border `1px solid #FECDD3`. Shape: Pill. Monospace typography.
- **AI Identifier Chip:** Background `tertiary-container` (`#EEF2FF`), text `#3730A3`, border `1px solid #C7D2FE`, paired with an indigo sparkle glyph.

### Question Options (Radio & Checkbox Cards)
- Outer container spans full width with `12px` padding and an 8px radius.
- **Resting:** Background `surface-container-lowest` (`#FFFFFF`), border `1px solid #E2E8F0`. Option key indicator (A, B, C, D) inside a circular pill (`surface-container`, text `#475569`).
- **Selected:** Background `tertiary-container` (`#EEF2FF`), border `1.5px solid primary` (`#4338CA`). Key indicator switches to solid `primary` with white text.
- **Review Mode (Correct):** Background `success-container` (`#ECFDF5`), border `1.5px solid success` (`#10B981`).
- **Review Mode (Incorrect):** Background `error-container` (`#FEF2F2`), border `1.5px solid error` (`#EF4444`).

### Question Number Navigator Grid
- Grid with 5 columns on desktop, 4px to 6px element gaps.
- Size: 40px x 40px square with an 8px radius, `JetBrains Mono` bold 13px text.
- **Answered:** `primary` background, `on-primary` text.
- **Unanswered:** `surface-container-lowest` background, `#64748B` text, `outline-variant` border.
- **Flagged for Review (Ragu-ragu):** `warning` background, `on-warning` text, small amber indicator flag in the upper-right corner.
- **Active / Current Question:** Encircled by a persistent `2px solid tertiary` (`#6366F1`) offset outline.

### AI Explanation Card ("Dijelaskan oleh AI")
- Surface: `tertiary-container` (`#EEF2FF`) with a subtle top border gradient (`#6366F1` to `#4338CA`).
- Header: Displays "Dijelaskan oleh AI" pill chip alongside model confidence indicators.
- Content: Explains algorithmic logic, time complexity, or syntax rules related to the question. Monospace syntax highlighting inside `#FFFFFF` nested panels with `8px` corner radiuses.

### Score Gauge & Progress Bar
- **Progress Track:** Height of 6px, background `outline-variant`, rounded pill finish.
- **Fill:** `primary` transitions dynamically to `success` upon exam completion.
- **Score Meter:** Dual-ring concentric SVG meter; outer circle `outline-variant`, inner active stroke `primary` with centered score readout in JetBrains Mono (`display-lg`).

## Implementation Rules (Read Before Coding)

1. **Wire every token above as a CSS variable or Tailwind `theme.extend` value first** (e.g. `--color-primary: #4338CA;` or `colors.primary` in `tailwind.config`). Do this once, in one place, before building any screen.
2. **Never write a raw hex value inside a component.** Every color, font-size, radius, and spacing value used anywhere in the app must reference a token name from this file (`primary`, `success-container`, `space-md`, `rounded-lg`, etc.), not a literal value typed inline.
3. If a screen needs a color or spacing value that has no token here, stop and add it to this file first (in the same style as the existing tokens), then use the token — don't invent an inline one-off value.
4. After building or editing any screen, take a screenshot and check it against this file's token table before marking the task done. List explicitly which tokens were used for the main visual elements (background, primary buttons, badges, borders) as part of your completion report.
