# Code Rules

## Rule Intent

These rules control the future front-end implementation architecture. They apply when code generation begins.

## Mandatory Rules

- Code generation may begin only after Skills, Rules, Design System, and content migration table exist.
- Use content data structures before building pages.
- Products, cases, scenarios, media, contacts, navigation, and CTA options must be centralized.
- Components must be business-aware, not generic visual fragments.
- Design tokens must control color, typography, spacing, radius, shadow, and motion.
- Next.js routes must reflect the approved information architecture.
- Tailwind usage must follow the design system.
- Framer Motion must be restrained and reduced-motion aware.
- Three.js must be isolated, lazy-loaded, and fallback-ready.
- Images and videos must have defined sizes, aspect ratios, alt text, and fallback behavior.
- SEO metadata and semantic structure are required for core pages.
- Contact and inquiry components must preserve product or scenario context.

## Forbidden Rules

- Do not put all homepage content in one massive component.
- Do not hardcode product specs in multiple places.
- Do not duplicate contact information.
- Do not scatter random colors and sizes through class strings.
- Do not create one-off buttons, one-off cards, or one-off form styles.
- Do not overuse client components.
- Do not block initial rendering with animation or WebGL.
- Do not add libraries without clear need.
- Do not write decorative Three.js effects before content is complete.
- Do not implement template sections just because they are common.

## Required Architecture

Minimum expected structure during coding:

- Content data
- Design tokens
- Base UI components
- Business components
- Page sections
- Page routes
- Motion utilities
- Media utilities
- Three.js modules
- Inquiry and contact system

## Failure Conditions

Code fails review if:

- A content update requires editing many unrelated components.
- Visual consistency depends on copy-pasted classes.
- Core pages cannot be rendered without JavaScript-heavy effects.
- Mobile layout is an afterthought.
- Accessibility and SEO are ignored.
- Performance is sacrificed for decoration.
- Components are named by layout only rather than business purpose.

## Generation Constraints

- Build data models first.
- Build design system primitives second.
- Build content sections third.
- Build pages fourth.
- Add motion and Three.js last.
- Run build or type checks before final delivery.
- If checks cannot run, document the exact reason.
