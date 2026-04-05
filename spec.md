# SK Web Solutions — Mobile-First Optimization

## Current State
The site is a dual-view React SPA (SK Web Solutions + Personal Portfolio) with a sticky navbar, site switcher, footer, and a floating SK Assistant. Most layout uses Tailwind's responsive prefixes (sm:, md:, lg:) but several areas still have usability issues on small screens:
- Navbar has a hamburger menu but no mobile bottom tab bar for faster navigation
- Hero section typography and button sizing are desktop-optimized
- Site switcher bar is small and hard to tap on mobile
- Category pills in the Marketplace overflow horizontally without scrolling hints
- Services grid collapses to 1 column but cards feel cramped with px-4 padding
- Footer stacks correctly but Admin Access button is tiny on mobile
- Quote Calculator and Contact forms need larger input tap targets
- SK Assistant chat bubble can overlap important content on small screens
- Overall touch targets below 44px minimum in several places

## Requested Changes (Diff)

### Add
- A fixed bottom navigation bar for mobile (home, marketplace, services, quote, contact) — visible only on small screens, hidden on md+
- Proper touch target sizes (min 44×44px) on all interactive elements
- Horizontal scroll snap for category pills in MarketplacePage on mobile
- Mobile-optimized padding and spacing (less wasted whitespace, tighter sections)
- Smooth scroll-to-top on page navigation
- Sticky bottom CTA bar on the hero section for mobile ("Get a Quote" floating bar)
- `safe-area-inset` padding support for phones with home bar (iOS notch handling)

### Modify
- Navbar: on mobile, simplify to logo + dark mode toggle + hamburger only; remove "Get a Quote" button (moved to bottom nav)
- Site switcher: increase pill height and font size on mobile for easier tapping
- Hero section: reduce heading size to text-3xl on mobile, improve button layout (stack vertically on small screens)
- MarketplacePage category pills: allow horizontal scroll on mobile (`overflow-x-auto scrollbar-hide flex-nowrap`)
- ServicesPage: ensure cards don't overflow on very small (320px) screens
- ContactPage and QuoteCalculatorPage: increase input height to min h-12 on mobile, larger label text
- Footer: make Admin Access button slightly larger tap target on mobile
- SKAssistant: ensure chat panel doesn't overflow the viewport on small screens; limit height to 70vh with scroll
- PersonalPortfolio: ensure profile photo and intro layout are clean on mobile
- Main content area: add `pb-20 md:pb-0` to account for fixed bottom nav on mobile

### Remove
- No features removed

## Implementation Plan
1. Update `Navbar.tsx` — simplify mobile header, remove Get a Quote CTA (handled by bottom nav)
2. Create `MobileBottomNav.tsx` — fixed bottom tab bar with 5 nav items, gold active state, safe-area inset support
3. Update `App.tsx` — render `<MobileBottomNav>` inside business site view, add `pb-20 md:pb-0` to content wrapper
4. Update `App.tsx` switcher bar — larger tap targets (py-3 text-sm on mobile)
5. Update `HomePage.tsx` — mobile hero typography, stacked buttons, mobile padding
6. Update `MarketplacePage.tsx` — horizontal scroll for category pills
7. Update `ContactPage.tsx` and `QuoteCalculatorPage.tsx` — larger input tap targets
8. Update `SKAssistant.tsx` — constrain chat panel height on mobile, add overflow scroll
9. Update `Footer.tsx` — larger admin access tap target
10. Update `index.css` — add scrollbar-hide utility, safe-area-inset padding helpers
