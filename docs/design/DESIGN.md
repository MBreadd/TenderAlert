---
name: Executive Precision
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#434653'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#2559bd'
  primary: '#00327d'
  on-primary: '#ffffff'
  primary-container: '#0047ab'
  on-primary-container: '#a5bdff'
  inverse-primary: '#b1c5ff'
  secondary: '#5c5f5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e2'
  on-secondary-container: '#626564'
  tertiary: '#3b3531'
  on-tertiary: '#ffffff'
  tertiary-container: '#524c48'
  on-tertiary-container: '#c6bdb7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419e'
  secondary-fixed: '#e1e3e2'
  secondary-fixed-dim: '#c5c7c6'
  on-secondary-fixed: '#191c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#eae1da'
  tertiary-fixed-dim: '#cec5bf'
  on-tertiary-fixed: '#1f1b17'
  on-tertiary-fixed-variant: '#4b4641'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
typography:
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 30px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style

This design system centers on **Trust, Clarity, and Precision**. Designed specifically for the Peruvian SME landscape, it moves away from the "tech-startup" aesthetic toward a sophisticated, "invisible analyst" persona. The UI functions as a high-end tool for procurement and decision-making, emphasizing information density without clutter.

The aesthetic follows a **High-Density Minimalism** approach:
- **Information-First:** Every element exists to facilitate data reading and action.
- **Editorial Influence:** Layouts should feel like digitized executive reports or high-end financial broadsheets.
- **Calm Confidence:** Large whitespace is used strategically to separate complex data sets, avoiding the "cramped" feeling typical of enterprise software.
- **Functional Restraint:** Color is used exclusively for status and primary actions. Decorative elements like gradients, blurs, or heavy shadows are strictly prohibited to maintain a grounded, professional atmosphere.

## Colors

The palette is built on a foundation of **Stone and Alabaster** to provide a warm, professional backdrop that is easier on the eyes than pure white.

- **Primary (Confident Blue):** Used for primary buttons, active states, and brand-identifying markers. It represents the authority of the Peruvian legal and business framework.
- **Secondary (Alabaster/Stone):** These warm neutrals define the surface layers. They provide a subtle distinction between the background and content containers without needing heavy borders.
- **Status (Muted Functional):** Success, Warning, and Danger colors are desaturated to ensure they don't visually "vibrate" against the primary blue. They indicate risk and opportunity in a measured, non-alarmist way.
- **Neutral:** A deep "Ink" black (#1C1917) is used for typography to ensure maximum legibility and a premium, printed feel.

## Typography

This system uses a high-contrast pairing to evoke the feeling of a modern financial publication.

- **Headlines (Libre Caslon Text):** Provides a traditional, authoritative, and literary feel. Use this for page titles, section headers, and key data callouts.
- **Body & Interface (Hanken Grotesk):** A sharp, contemporary sans-serif that offers exceptional clarity at small sizes. Its precise geometry complements the classic nature of the serif headlines.
- **Labels:** Small caps and increased letter spacing should be used for metadata and table headers to distinguish them from interactive body text.

## Layout & Spacing

The layout follows a **Rigid Grid System** inspired by technical blueprints and executive summaries.

- **Grid Model:** A 12-column fluid grid for desktop with fixed margins of 48px.
- **Vertical Rhythm:** A strict 4px baseline grid ensures that all elements—from icons to line heights—align perfectly, creating a sense of "engineered" order.
- **Sectioning:** Use large `xl` (48px) spacing between major logical blocks to allow the data to breathe.
- **Mobile Adaptation:** On mobile devices, margins reduce to 16px and the grid collapses to a single column, but the 4px baseline rhythm remains constant.

## Elevation & Depth

To maintain the "Executive Report" aesthetic, depth is conveyed through **Tonal Layering** rather than shadows.

- **Base Layer:** The application background uses a very light Stone tint (#F8F9F8).
- **Surface Layer:** Primary cards and content containers use pure White (#FFFFFF).
- **Outlines:** All containers are defined by a 1px solid border (#E7E5E4). Do not use shadows to separate cards unless it is a floating modal or a menu.
- **Interactive Depth:** On hover, a 1px border might shift to the Primary Blue, or a very subtle, tight shadow (4px blur, 5% opacity) may be applied to suggest lift.

## Shapes

The shape language is controlled and sophisticated. While sharp edges can feel aggressive, overly rounded "bubble" shapes feel too casual for SaaS. 

- **Standard Radius:** 8px (0.5rem) is the default for buttons, inputs, and small components.
- **Container Radius:** 12px (0.75rem) is used for cards and main content modules to provide a subtle "modern" frame to the data.
- **Iconography:** Use 2px stroke-width icons with slight corner rounding to match the typography's terminal ends.

## Components

- **Buttons:** Primary buttons use the Confident Blue with white text. Secondary buttons use a white background with a Stone 1px border. There are no gradients.
- **Cards:** Cards are the primary vessel for information. They feature a 1px Stone border, 12px corner radius, and no shadow. The header of the card should use a subtle Stone background (#F1F0EE) to separate metadata from the content.
- **Data Tables:** These are the heart of the platform. Use `body-sm` for row content and `label-md` for headers. Row separators should be 1px Stone-200. No zebra striping; use hover highlights instead.
- **Input Fields:** Fields are rectangular with an 8px radius. Use a 1px border. On focus, the border changes to Primary Blue and adds a 2px "ring" of the same color at 10% opacity.
- **Chips/Badges:** Use a "Pill" shape (full rounding). Status badges should use the muted status colors with a low-opacity background tint (e.g., Success text on a 10% opacity Green background).
- **AI Analyst Insights:** These sections should be styled like a "Memo" or "Note" within a card, using a subtle vertical accent bar of Primary Blue on the left to indicate AI-generated synthesis without using "sparkle" or "robot" icons.
