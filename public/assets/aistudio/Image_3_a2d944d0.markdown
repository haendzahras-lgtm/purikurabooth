---
name: Purikura Pop
colors:
  surface: '#fff7fb'
  surface-dim: '#edd1ee'
  surface-bright: '#fff7fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ffeffd'
  surface-container: '#ffe6ff'
  surface-container-high: '#fbdffd'
  surface-container-highest: '#f6daf7'
  on-surface: '#26152a'
  on-surface-variant: '#564147'
  inverse-surface: '#3c2a40'
  inverse-on-surface: '#ffebfe'
  outline: '#897177'
  outline-variant: '#dcbfc6'
  surface-tint: '#ab2b64'
  primary: '#ab2b64'
  on-primary: '#ffffff'
  primary-container: '#ff6ea7'
  on-primary-container: '#71003c'
  inverse-primary: '#ffb0c9'
  secondary: '#006783'
  on-secondary: '#ffffff'
  secondary-container: '#70d6ff'
  on-secondary-container: '#005c75'
  tertiary: '#70518d'
  on-tertiary: '#ffffff'
  tertiary-container: '#b492d4'
  on-tertiary-container: '#462963'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e3'
  primary-fixed-dim: '#ffb0c9'
  on-primary-fixed: '#3e001e'
  on-primary-fixed-variant: '#8b0b4c'
  secondary-fixed: '#bce9ff'
  secondary-fixed-dim: '#6cd3fc'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#004d63'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#dcb8fc'
  on-tertiary-fixed: '#290a45'
  on-tertiary-fixed-variant: '#573974'
  background: '#fff7fb'
  on-background: '#26152a'
  surface-variant: '#f6daf7'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Syne
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system captures the exuberant, tactile nostalgia of early-2000s Japanese print-club sticker booths (Purikura) fused with Y2K bubbly cyber-pop. It targets digital natives, Gen Z creators, and nostalgic millennials seeking a joyful, expressive, and interactive photo customization experience.

The design movement combines **Neo-Brutalism** and **Tactile Y2K Bubbly/Skeuomorphic Pop**:
- High-energy, thick, crisp borders grounded by warm pastel planes.
- Tactile, glossy "gel pen" highlights and plastic button bevels that mimic physical sticker vending machines, flip phones, and arcade touchpads.
- Layered sticker playfulness, decorative sparkle glyphs (✧, ✦), hearts, and retro camera HUD overlays that feel interactive, spontaneous, and unapologetically fun.

## Colors
The palette balances sweet confectionery tones with electric cyber highlights against warm, non-glare cream canvases.

- **Canvas & Backgrounds**: Soft warm creams (`#FFFDF7` main surface, `#FFF5EA` secondary container) evoke vintage sticker backing paper and warm incandescent booth lighting.
- **Primary (`#FF6EA7`)**: Vibrant bubblegum pink used for primary calls-to-action, active capture triggers, and stamp outlines.
- **Secondary (`#70D6FF`)**: Crisp sky blue delivering electric cyber-contrast for lens controls, mode switches, and toggles.
- **Tertiary (`#D8B4F8`)**: Pastel lavender offering soft chromatic balance for tool drawers, secondary badges, and decorative frames.
- **Accent (Mint)**: `#7AE582` applied selectively for success states, flash toggles, and photo-ready indicators.
- **Neutral Deep (`#2B1A2F`)**: A dark plum-black used for all structural borders, text, and offset drop shadows to keep the palette playful and prevent harsh industrial starkness.

## Typography
Typography reflects the energetic crossover between Y2K editorial styling and modern clarity:

- **Headlines & Displays**: `Syne` in extra-bold weights delivers an expressive, chunky, geometric retro character with wide proportions reminiscent of late-90s arcade marquees and sticker sheets.
- **Body & Labels**: `Plus Jakarta Sans` provides soft, rounded terminals that maintain the friendly aesthetic while ensuring micro-labels, camera HUD metadata, and sticker panel tabs remain sharply legible.
- **Styling Rules**: Section headers and display text default to uppercase or title-case with tight tracking. Micro-labels on buttons and tags leverage bold weights with gentle expansion for quick scanning under live camera conditions.

## Layout & Spacing
The layout follows a responsive hybrid model: a fixed-ratio stage for the photobooth viewfinder surrounded by fluid tool panels and modular sticker trays.

- **Desktop (1024px+)**: A balanced 12-column layout centered on a 4:3 or 3:4 booth preview viewport (spanning 7 columns), flanked by stamp toolboxes, frame selectors, and layer management panels (spanning 5 columns). Section margins expand to `2.5rem`.
- **Tablet (768px - 1023px)**: Viewport anchors the top half of the screen; tools align horizontally below in touch-scrollable ribbons with `1.5rem` gutters.
- **Mobile (<768px)**: Viewport dominates full width with `1rem` safe-area canvas margins. Tool ribbons, stamp shelves, and shutter triggers stack into sticky bottom sheets designed for one-handed thumb interaction.

## Elevation & Depth
Depth in this system avoids diffuse realistic lighting in favor of tactile **Chunky Neo-Pop Elevation**:

- **Hard Offset Cast Shadows**: Containers, buttons, and decorative badges utilize crisp, unblurred drop shadows tinted with the deep neutral tone (`#2B1A2F`) offset by `3px 3px` or `5px 5px`.
- **Gloss & Gel Highlights**: Active interactive elements feature an internal top-edge highlight (`inset 0 2px 0 rgba(255, 255, 255, 0.6)`) to simulate the bulbous, glossy sheen of 3D epoxy gel stickers.
- **Layer Stacking**: Photos sit at base level (`z-0`), decorative border frames sit above (`z-10`), interactive stamps/stickers float dynamically (`z-20`), and camera HUD markers / viewfinder corners anchor overlay alerts (`z-30`).
- **Tactile Depress**: On hover and active states, buttons physically displace downward and rightward by `2px` while their offset shadow shrinks, creating an unmistakable physical arcade-switch feel.

## Shapes
The shape language is ultra-rounded and pill-dominated (`roundedness: 3`):
- Action buttons, badges, status chips, and filter toggles adopt fully rounded pill silhouettes (`rounded-full` / `9999px`).
- Photo viewfinders, tool drawers, and modal cards utilize `rounded-xl` (`3rem` or `24px-32px`) to evoke toy cameras, handheld plastic gaming consoles, and curved cathode-ray arcade screens.
- All structural containers carry a defined `2.5px` or `3px` solid stroke in deep plum (`#2B1A2F`), preserving visual structure and physical presence against bright pastel backgrounds.

## Components

### 1. Buttons
- **Primary (Shutter / Print / Save)**: Full pill shape, `#FF6EA7` fill, `2.5px` `#2B1A2F` outline, `4px 4px 0 #2B1A2F` drop shadow, and a top glossy inner-white highlight. Text in `Plus Jakarta Sans` 700 uppercase.
- **Secondary (Tool Toggle / Reset)**: `#70D6FF` or `#D8B4F8` fill, identical border and shadow treatment, switching to `#FFFDF7` fill on active selection.
- **Icon / Shutter Triggers**: Circular form factor with an internal concentric ring and sparkle glyph decoration (`✧`).

### 2. Viewfinder & Camera HUD
- Framed with bold rounded corners, featuring crosshair guides, timestamp overlays in a monospace-inspired rounded badge, and blinking "REC" / "READY" pill indicators in mint (`#7AE582`).
- Corner brackets mimic handheld Japanese digital cameras with playful star cutouts.

### 3. Chips & Filter Badges
- Compact pill-shaped containers with `1.5px` borders and soft pastel fills.
- When active, chip pops with a contrasting outline, `2px 2px` drop shadow, and a leading icon (heart, star, cherry).

### 4. Cards & Frame Selectors
- Cream-backed containers (`#FFF5EA`) with `2.5px` borders.
- Previews feature classic Purikura layout strips (double 2x2 grids, vertical 3-cut film strips) with bright border options (glitter pink, sky checkerboard, pastel gradients).

### 5. Input Fields & Sliders
- **Text Inputs**: Generously padded pill shapes with cream interiors, deep plum border, and bubblegum pink focus rings.
- **Range Sliders (Brush Size / Stamp Scale)**: Thick track with chunky circular knobs styled like candy pearls or glossy trackballs.

### 6. Sticker & Stamp Trays
- Grid shelves with subtle inner cream wells. Stickers rest with faint white drop-out borders to look peelable and ready for drag-and-drop placement onto the canvas.