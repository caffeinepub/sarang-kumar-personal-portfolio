# SK Web Solutions

## Current State
Fresh rebuild from scratch — no existing source files.

## Requested Changes (Diff)

### Add
- Full dual-purpose platform: SK Web Solutions (primary) + Personal Portfolio (secondary)
- Site switcher: SK Web Solutions (left) | Personal Portfolio (right)
- SK Web Solutions as default landing page

**SK Web Solutions (Business Site — Dark Navy & Gold)**
- Navbar: Logo, Home, Marketplace, Services, Case Studies, Quote Calculator, Contact, Dark Mode Toggle, hidden Admin Access link in footer
- Hero: "Crafting High-Performance Digital Solutions for Modern Businesses" + "Serving Hyderabad & Beyond" location tag
- Stats bar (projects delivered, clients, years experience, satisfaction)
- Services section: Web Development, Interior Design Services, E-commerce, Custom Apps
- Tech Stack section: 10 technology badges (React, Next.js, WordPress, Tailwind, Node.js, Tableau, MongoDB, Stripe, Vue.js, Firebase)
- Case Studies section: 3 cards (RetailMax, EduLearn, PropertyHub) with Challenge/Solution/Results
- Website Marketplace: listings with search bar (queries tracked in admin), filters
- Service Packages: Starter, Professional, Enterprise (Interior Design packages included)
- Quote Calculator: multi-step (project type, page count, add-ons), live price estimate
- Contact/Inquiry form with full validation
- Security badges in footer: SSL Secured, GDPR Compliant, Secure & Reliable
- Footer: LinkedIn link, AI Demo Production link (https://sarangkumarnetwork.my.canva.site/sarang-productions), hidden "Admin Access" link
- Micro-interactions: hover scale + gold glow on cards and buttons
- Smooth scroll
- Dark mode toggle (moon/sun icon, saved preference)
- Visitor tracking: every page visit anonymously recorded
- Floating SK Assistant chat widget (gold pulsing bubble, bottom-right), answers all queries about services, pricing, timelines, tech stack, contact, Sarang background, case studies, interior design — NO external API

**Admin Dashboard (login required — sarangkumar408@gmail.com)**
- Overview tab: KPI tiles (total listings, clients, inquiries, page visits)
- Listings tab: full CRUD for website listings
- Packages tab: full CRUD for service packages
- Inquiries tab: manage submissions, update status, add notes
- Master Data tab: categories, technology tags
- Users tab: view all users, change roles
- Activity tab: recent activity feed (logins, searches, inquiries), top search terms, visitor count

**Personal Portfolio (secondary)**
- Professional intro landing page: bold "Web Designer and Developer" heading, square box border, gold accents, square profile photo placeholder, executive layout, "NEXT" button
- About/Skills: expanded skills including Website Design & Development, Data Analysis
- LinkedIn link: https://www.linkedin.com/in/sarang-kumar-854214257/
- Footer: AI Demo Production link + LinkedIn icon
- Advertisement banner: labeled "SK Website Designer & Developer"
- No Knowledge Cards section

### Modify
- N/A (fresh build)

### Remove
- N/A (fresh build)
- Knowledge Cards section must NOT be included
- No client login requirement — all services visible without login
- No login button in navbar
- No external API calls in SK Assistant

## Implementation Plan
1. Backend (Motoko): listings CRUD, packages CRUD, inquiries, master data, users/roles, activity tracking (logins, searches, inquiries, page visits), visitor tracking
2. Frontend: dual-site architecture with switcher, full SK Web Solutions pages, admin dashboard, personal portfolio pages, SK Assistant chat widget
3. Authorization component for admin role-based access
4. ErrorBoundary to prevent blank white page crashes
5. Dark mode toggle with localStorage persistence
