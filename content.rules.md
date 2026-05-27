# Content Rules

## Rule Intent

These rules control all content extraction, rewriting, migration, and page information architecture for the new Shitian UAV website.

Old website content is the source. Old website design is forbidden.

## Mandatory Rules

- All real product information from the old website must be migrated.
- All real product specifications must be migrated into structured data.
- All valuable case information must be migrated, cleaned, and reorganized by scenario.
- Company introduction, founding background, patents, successful cases, honors, contact information, QR codes, product images, operation images, and videos must be preserved when usable.
- Every migrated content item must have a destination: home, product, scenario, case, about, contact, or archive.
- Content must be rewritten for a premium Chinese low-altitude economy brand.
- Every product must have a role, not just a name.
- Every scenario must be connected to a product, a task, and a measurable result.
- Every case must retain factual anchors: place, time, product, task, result, and data when available.
- Product parameters must be translated into operational meaning.
- Content must support B2B, B2G, overseas partnership, and high-value equipment inquiry paths.

## Forbidden Rules

- Do not migrate old website layout, visual structure, module order, carousel behavior, sidebar logic, breadcrumb presentation, CMS metadata, or template components.
- Do not copy old marketing text verbatim unless it is a factual statement or specification.
- Do not use generic product-list text such as "welcome to our products".
- Do not use "buy now", "hot product", "factory direct", "low price", "high cost performance", or similar low-end phrases.
- Do not dump long regulations or industry news into the new site.
- Do not create a homepage made from company intro plus product cards plus news cards.
- Do not bury the core products under generic company storytelling.
- Do not flatten cases into a simple news list.
- Do not hide contradictory information. Mark it as pending confirmation.

## Required Content Model

Every product must include:

- Model name
- Product category
- Strategic role
- Core capabilities
- Key specifications
- Applicable scenarios
- Related cases
- Related media
- Inquiry CTA context

Every case must include:

- Case title
- Product model
- Scenario
- Location
- Time
- Task
- Result
- Key data
- Media
- Source URL or source note

Every scenario must include:

- Scenario name
- Operational pain point
- Recommended product
- Task flow
- Proof case
- Value data
- CTA

## Failure Conditions

Content fails review if:

- It reads like a generic UAV company website.
- It uses old website text without rewriting.
- It presents specifications without explaining operational value.
- It cannot prove product capability with cases or data.
- It contains unverifiable exaggerated claims.
- It uses template words that could fit any technology company.
- It does not create a clear path to inquiry.

## Generation Constraints

- Before code generation, create a content migration table.
- Do not start page implementation until product, scenario, case, contact, and media data structures are defined.
- All specifications must be reusable data, not decorative text.
- All contact information must come from a single source of truth.
- All page copy must be traceable to migrated content or newly approved brand copy.
