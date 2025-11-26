# Humanizer AI - Design Guidelines

## Design Approach

**Selected Approach**: Design System Approach inspired by Linear and ChatGPT interfaces

**Rationale**: As a productivity tool focused on text transformation, efficiency and clarity take priority over visual flourish. Draw from Linear's clean efficiency and ChatGPT's focused simplicity to create a distraction-free experience that keeps users focused on their content.

## Core Design Elements

### Typography

**Font Family**: Inter (Google Fonts) - excellent readability for both UI and content
- **Headings**: Inter Bold (700)
  - H1: text-5xl (landing), text-3xl (app)
  - H2: text-3xl (landing), text-xl (app)
  - H3: text-xl
- **Body Text**: Inter Regular (400)
  - Large: text-lg (input/output areas)
  - Base: text-base (UI elements)
  - Small: text-sm (helper text, character counts)
- **Monospace**: JetBrains Mono for character counts and technical elements

### Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section spacing: py-16 to py-24
- Element gaps: gap-4, gap-6, gap-8
- Consistent container: max-w-7xl mx-auto px-6

**Grid Structure**:
- Landing page: Single column centered content (max-w-4xl) for hero/features
- Tool interface: Two-column layout for input/output (lg:grid-cols-2)
- Feature cards: 3-column grid on desktop (grid-cols-1 md:grid-cols-3)

### Component Library

#### Landing Page Components

**Hero Section**:
- Height: min-h-screen with flex centering
- Layout: Single centered column (max-w-4xl)
- Headline: Large, bold statement about transforming AI text to human-like writing
- Subheadline: Brief explanation of the tool's value
- CTA: Large primary button "Try It Free" + secondary "See Example"
- Image: Background pattern or abstract AI visualization (subtle, not distracting)
- Trust indicator: "Trusted by 50,000+ writers" with small user avatar cluster

**Features Section** (py-20):
- 3-column grid showcasing key features
- Each card: Icon (Heroicons), bold title, 2-3 line description
- Features: "Multiple Modes", "Instant Results", "Copy & Export"
- Cards have subtle borders, rounded-xl, p-8

**How It Works** (py-20):
- 3-step process visualization
- Numbered steps (1, 2, 3) in large circular badges
- Step descriptions in vertical flow on mobile, horizontal on desktop
- Visual connectors between steps (arrow icons)

**Example Transformation** (py-20):
- Side-by-side comparison (2-column on desktop)
- "Before" panel: Robotic AI text example
- "After" panel: Humanized version
- Visual distinction through subtle panel treatments

**Modes Showcase** (py-16):
- 3 mode cards: Casual, Professional, Creative
- Each shows sample input/output snippet
- Icon representing each mode style

**CTA Section** (py-24):
- Centered, focused call-to-action
- Large headline "Start Humanizing Your Text"
- Primary CTA button with supporting text about free usage
- Secondary information about features

**Footer** (py-12):
- Simple centered layout
- Links: About, Privacy, Terms, Contact
- Social icons (if applicable)
- Copyright notice

#### Tool Interface Components

**Main Container**:
- Full viewport height (min-h-screen)
- Header bar with logo and mode selector
- Two-panel layout for input/output (equal width on desktop)

**Header Bar** (h-16):
- Sticky positioning (sticky top-0)
- Logo on left
- Mode selector in center (pill-style toggle buttons)
- Character limit indicator on right
- Border bottom for separation

**Input Panel**:
- Full height textarea with resize-none
- Placeholder: "Paste your text here..."
- Character counter (bottom-right corner, text-sm)
- Clear button (X icon, appears when text present)
- Padding: p-6

**Output Panel**:
- Matching height to input panel
- Displays humanized text with same formatting
- Copy button (top-right corner, clipboard icon)
- Loading state: Subtle shimmer animation
- Empty state: Helpful message "Your humanized text will appear here"

**Mode Selector**:
- Horizontal button group with 3 options
- Active state clearly distinguished
- Smooth transition between modes
- Icons: Heroicons (ChatBubbleBottomCenterTextIcon, BriefcaseIcon, SparklesIcon)

**Action Buttons**:
- Primary: "Humanize Text" (large, prominent, bottom of input panel or fixed bar)
- Secondary: Copy to clipboard (icon button with tooltip)
- Disabled states when no input text

**Loading Indicator**:
- Progress bar at top of output panel during processing
- Subtle pulse animation
- Text: "Humanizing your text..."

### Accessibility

- Minimum touch targets: 44x44px for all interactive elements
- Clear focus states on all inputs and buttons (ring-2 ring-offset-2)
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Semantic HTML throughout (main, section, article)
- Character counter includes aria-live for screen readers

### Images

**Hero Background**: Abstract, minimal illustration representing AI/text transformation (flowing lines, gradient mesh, or geometric patterns). Should be subtle and not compete with content.

**Feature Icons**: Use Heroicons exclusively - no custom SVG generation

**Example Section**: Screenshot or mockup showing before/after transformation (can be designed graphical representation rather than photo)

## Animation Strategy

**Minimal and Purposeful**:
- Fade-in on scroll for landing page sections (subtle, once)
- Smooth height transitions for expanding panels
- Button hover states (slight scale, background shift)
- Copy success feedback (brief checkmark animation)
- NO scroll-triggered animations beyond initial fade
- NO parallax effects
- NO complex reveal animations

## Layout Principles

1. **Breathing Room**: Generous spacing between sections (py-20 minimum)
2. **Focused Width**: Content constrained to max-w-7xl for readability
3. **Clear Hierarchy**: Size and weight distinguish importance
4. **Symmetry**: Centered layouts for landing, balanced split for tool
5. **Responsiveness**: Single column mobile, multi-column desktop (lg: breakpoint)