# Motion Rules

## Rule Intent

These rules control animation, transitions, scroll behavior, and motion restraint.

Motion must support cinematic product storytelling, not decoration.

## Mandatory Rules

- Motion must have a narrative purpose.
- Motion should feel like camera movement, focus shift, reveal, or mechanical precision.
- Scroll animation must guide attention through product, data, scenario, and proof.
- Motion must be calm, premium, and readable.
- Framer Motion or equivalent animation must respect reduced motion preferences.
- Page transitions must be subtle and fast.
- Data reveals must be restrained and readable.
- Product reveals must enhance physical presence.
- Motion must never block content access.

## Forbidden Rules

- Do not use random fly-ins, bouncing, spinning, pulsing, shaking, or excessive parallax.
- Do not animate every element.
- Do not use motion to compensate for weak content.
- Do not create scroll hijacking that prevents normal reading.
- Do not make text appear so slowly that scanning becomes difficult.
- Do not use flashing glows, animated neon borders, or particle motion.
- Do not animate specification tables in a way that reduces readability.
- Do not use decorative counters without data purpose.
- Do not make mobile interactions heavy.

## Required Motion Language

Allowed motion patterns:

- Slow reveal
- Camera-like push-in
- Soft mask reveal
- Product detail focus
- Section crossfade
- Horizontal motion only when tied to product or timeline narrative
- Metric reveal with immediate final readability
- Media fade with stable layout

## Failure Conditions

Motion fails review if:

- It looks like a generic landing page template.
- It distracts from product, case, or inquiry.
- It makes the page feel like AI-generated tech demo.
- It harms performance.
- It creates layout shift.
- It ignores reduced motion.
- It makes mobile browsing uncomfortable.

## Generation Constraints

- Define motion tokens: duration, easing, delay limits.
- Keep animation scope local to meaningful modules.
- Use transform and opacity where possible.
- Avoid layout-triggering animation.
- Provide reduced-motion fallback.
- Test scrolling on desktop and mobile.
