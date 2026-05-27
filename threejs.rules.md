# Three.js Rules

## Rule Intent

These rules control all Three.js usage. Three.js is allowed only when it improves product understanding or scenario storytelling.

## Mandatory Rules

- Three.js must serve product narrative, not visual spectacle.
- Every 3D scene must answer a specific product or scenario question.
- Use Three.js for product structure, scale, rotor logic, payload configuration, flight path, work radius, or scene operation explanation.
- Three.js must be tied to a specific product, model, or mission.
- 3D must have static fallback.
- 3D must be lazy-loaded unless absolutely required for first viewport storytelling.
- Mobile and low-performance devices must receive simplified or fallback experiences.
- Scroll-driven 3D must remain smooth, readable, and controlled.
- 3D scene naming must be specific to product or mission.

## Forbidden Rules

- Do not use Three.js for particle oceans.
- Do not use wireframe earth, random flight lines, neon grids, space backgrounds, fake radar, or abstract glowing geometry.
- Do not spin the drone endlessly for decoration.
- Do not make 3D interaction required to understand the page.
- Do not use heavy models before confirming assets and performance.
- Do not block first contentful paint with 3D.
- Do not use WebGL effects that resemble generic AI tech demos.
- Do not let Three.js obscure CTA, text, or specifications.
- Do not promise final 3D model fidelity before model assets exist.

## Required Technical Controls

- Dynamic import for 3D modules.
- DPR cap.
- Texture size budget.
- Model compression when applicable.
- Static image fallback.
- Reduced motion fallback.
- Mobile fallback.
- Canvas size constraints.
- Cleanup on unmount.
- No unnecessary React state updates inside render loops.

## Failure Conditions

Three.js fails review if:

- Removing it does not reduce product understanding.
- It exists mainly to look futuristic.
- It looks like a generic technology template.
- It lowers performance.
- It is not connected to a real product or mission.
- It has no fallback.
- It competes with real operation footage.

## Generation Constraints

- Write a Three.js scene brief before implementation.
- State scene purpose, product, user insight, assets, fallback, and performance budget.
- Do not create Three.js code until page narrative and product data are defined.
- Keep 3D modules separated from normal content components.
