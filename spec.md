# SK Web Solutions

## Current State
Dual-purpose platform: SK Web Solutions (primary) + Personal Portfolio (secondary). Built in a single App.tsx (~3584 lines). Uses dark navy (#0a1628) and gold (#d4af37) color scheme. Services section shows 3 cards (Custom Web Design, Web Development, SEO & Growth). No interior design services anywhere.

## Requested Changes (Diff)

### Add
- Interior Design Services section as a new dedicated section on the SK Web Solutions homepage
  - 4 interior design service cards: Residential Interior Design, Commercial Space Design, 3D Visualization & Rendering, Interior Consultation
  - Each card with icon, title, description, price range (₹), and a CTA button
  - Section header: "Interior Design Services" with subtitle
- Interior Design option in the Quote Calculator (project type selector)
- Interior Design answers in SK Assistant chat widget
- Interior Design as a new listing category

### Modify
- Overall interface visual refresh:
  - Cleaner card layouts with rounded corners and subtle shadows
  - Better typography hierarchy and spacing
  - More modern navbar with glassmorphism effect
  - Hero section with gradient overlay and more visual punch
  - Services section grid improved — 3 web + 4 interior = show as two distinct rows/sections
  - Footer modernized with better layout
  - Consistent section alternating backgrounds (white / light slate)

### Remove
- Nothing removed

## Implementation Plan
1. Add `InteriorDesignSection` component after "What We Offer" / services section on the SK Web Solutions homepage
2. 4 interior design cards using icons from lucide-react (Home, Layers, Box, MessageSquare)
3. Add interior design to quote calculator project type options
4. Add interior design responses to ChatWidget
5. Visual refresh: update navbar to glassmorphism, improve card radius/shadows, improve hero typography
6. Generate interior design service cards with professional INR pricing
