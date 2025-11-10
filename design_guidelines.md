# SkillBridge Design Guidelines

## Design Approach

**Selected Approach:** Hybrid (Design System + Custom Branding)

Drawing inspiration from modern professional platforms like LinkedIn's clean information architecture and modern SaaS applications. The design emphasizes clarity, professionalism, and trustworthiness through a refined blue and slate color palette with full dark mode support.

**Key Principles:**
- Clean, professional layouts that inspire trust
- Modern, corporate-friendly aesthetic
- Information hierarchy that makes gig discovery effortless
- Accessible design with proper contrast in both light and dark modes
- Sophisticated color palette suitable for professional environments

---

## Typography

**Font Family:** Poppins (via Google Fonts CDN)

**Hierarchy:**
- **Headings (H1):** 2.5rem (text-4xl), font-weight 700, for page titles
- **Headings (H2):** 2rem (text-3xl), font-weight 600, for section headers
- **Headings (H3):** 1.5rem (text-2xl), font-weight 600, for card titles
- **Body Text:** 1rem (text-base), font-weight 400, for descriptions
- **Small Text:** 0.875rem (text-sm), font-weight 400, for metadata
- **Labels:** 0.875rem (text-sm), font-weight 500, uppercase for form labels
- **Buttons:** 1rem (text-base), font-weight 600

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent spacing
- Tight spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)
- Section padding: p-8, py-12 (32px, 48px)
- Page margins: mx-auto with max-w containers

**Container Strategy:**
- Page containers: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Content cards: max-w-4xl for forms, full width for listings
- Dashboard grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
- **Top Navigation Bar:** Fixed header with logo left, navigation center, user menu right
- Includes: Logo/brand, main nav links (Dashboard, Browse Gigs, Post Gig), user avatar/dropdown
- Height: h-16, with subtle shadow (shadow-md)

### Authentication Pages (Login/Register)
- **Layout:** Centered card on full-height page with subtle gradient background
- **Card:** max-w-md, rounded-xl, shadow-2xl, p-8
- **Form Spacing:** space-y-6 for form groups
- **Input Fields:** Full-width with h-12, rounded-lg, border with focus states
- **Role Selection:** Toggle or radio buttons prominently displayed
- **Submit Button:** Full-width, h-12, rounded-lg, font-semibold

### Dashboard Layout
- **Student Dashboard:** 
  - Welcome header with name and quick stats
  - "Matched Gigs" section with grid of gig cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6)
  - Sidebar with profile summary and skills tags

- **Business Dashboard:**
  - Stats overview (posted gigs, applications, active gigs) in 3-column grid
  - "Your Posted Gigs" section with larger cards including applicant count
  - Quick action button to post new gig

### Gig Cards
- **Design:** Rounded-xl cards with shadow-lg, hover:shadow-2xl transition
- **Structure:**
  - Header with gig title (text-xl font-semibold) and budget badge
  - Description preview (2-3 lines with text-ellipsis)
  - Footer with location icon + text, company name
  - "Apply" or "View Details" button (if student) or "Manage" (if business owner)
- **Spacing:** p-6, space-y-4 for internal elements

### Post Gig Form
- **Layout:** Single column form in max-w-2xl container
- **Form Fields:**
  - Title: Full-width input
  - Description: Textarea with min-h-32
  - Budget: Number input with currency symbol
  - Location: Text input with location icon
  - All fields with space-y-4 between them
- **Action Buttons:** Right-aligned with "Cancel" and "Post Gig" buttons side-by-side

### Gig Details/Application Modal
- **Design:** Overlay modal (fixed inset-0 with backdrop blur)
- **Content:** max-w-3xl centered card with:
  - Full gig details
  - Company information section
  - Application form (for students) or applicants list (for businesses)
  - Close button (top-right)

### Profile Cards
- **Student Profile:** 
  - Avatar placeholder (w-24 h-24 rounded-full)
  - Skills displayed as pill badges (rounded-full px-3 py-1)
  - Bio with max 3 lines initially, "Read more" expansion

- **Business Profile:**
  - Company name prominent
  - Description and posted gigs count
  - Contact button

### Skills Tags/Badges
- **Design:** Inline-flex items with rounded-full, px-3, py-1, text-sm
- **Usage:** Display student skills, gig categories, status indicators

### Buttons
- **Primary CTA:** Rounded-lg, px-6, py-3, font-semibold, shadow-md with hover lift
- **Secondary:** Outlined version with border-2, transparent background
- **Icon Buttons:** Square or circular (w-10 h-10) for actions like delete, edit

### Empty States
- **Design:** Centered content with icon, heading, and descriptive text
- **Usage:** No gigs posted yet, no applications, search with no results
- **Structure:** Vertical stack with icon (w-16 h-16), text-xl heading, text-sm description, and CTA button

---

## Images

**Hero Image:** Not applicable - this is a functional platform, not a marketing site. Focus on dashboard efficiency.

**Profile Avatars:** Circular placeholders (via SVG icons or gradient backgrounds with initials) until user uploads

**Empty State Illustrations:** Use Heroicons for simple iconography in empty states (briefcase for no gigs, user-group for no applicants)

---

## Visual Enhancements

**Shadows:** Use Tailwind's shadow utilities progressively (shadow-sm → shadow-md → shadow-lg → shadow-xl) for depth hierarchy

**Borders:** Rounded corners throughout (rounded-lg for cards, rounded-full for pills and avatars)

**Gradients:** Subtle background gradients on auth pages and empty states for visual interest

**Transitions:** Apply transition-all duration-200 to interactive elements (cards, buttons) for smooth hover effects

**Icons:** Font Awesome via CDN for UI icons (briefcase, location-dot, dollar-sign, users, etc.)

---

## Accessibility

- All form inputs with visible labels and focus states
- Sufficient color contrast for text readability
- Keyboard navigation support for all interactive elements
- ARIA labels for icon-only buttons
- Focus visible rings (ring-2 ring-offset-2) on all focusable elements