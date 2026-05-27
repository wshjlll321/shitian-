# Typography Rules

## Rule Intent

These rules control typography, hierarchy, reading rhythm, bilingual readiness, and premium industrial tone.

## Mandatory Rules

- Typography must feel premium, calm, precise, and engineered.
- Headings must establish authority without shouting.
- Body copy must be readable, restrained, and professional.
- Numbers and specifications must be easy to scan.
- Chinese typography must be treated as primary, with English support prepared for overseas conversion.
- Line length must be controlled for reading comfort.
- Page rhythm must use different text densities: cinematic short lines, technical specification tables, case summaries, and conversion copy.
- Product names, specifications, and CTA labels must be consistently styled.
- Text blocks must have enough whitespace around them.
- Technical values must use consistent units, punctuation, and spacing.

## Forbidden Rules

- Do not use oversized hero typography inside compact cards or panels.
- Do not use viewport-width-based font scaling.
- Do not use negative letter spacing.
- Do not use too many font families.
- Do not use generic AI slogans as headings.
- Do not make every section "title + subtitle + button".
- Do not center-align every text block.
- Do not place long paragraphs on top of complex images.
- Do not use decorative display fonts that weaken engineering credibility.
- Do not use dense all-caps English styling as a cheap premium signal.

## Required Hierarchy

Homepage typography must support:

- Brand positioning statement
- Product capability statement
- Scenario proof statement
- Technical metric strip
- Case evidence
- Conversion CTA

Product page typography must support:

- Product role
- Mission statement
- Key capability
- Specification table
- Scenario explanation
- Case link

## Failure Conditions

Typography fails review if:

- It looks like a generic SaaS landing page.
- All sections use identical heading patterns.
- Specification text is hard to compare.
- Chinese copy looks cramped or mechanically translated.
- English labels dominate without purpose.
- Text overlaps media or UI.
- The page cannot be understood by scanning headings alone.

## Generation Constraints

- Define font tokens before page implementation.
- Define at least four typographic levels: hero, section title, technical label, body.
- Define numeric styling for key metrics.
- No text component may rely only on viewport width for sizing.
- All long headings must wrap gracefully on mobile.
- All buttons must have text that fits at mobile widths.
