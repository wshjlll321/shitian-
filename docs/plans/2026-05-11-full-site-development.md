# Shitian UAV Full Site Development Plan

> **Goal:** Build the complete premium Chinese low-altitude economy UAV website from structured migrated content.

**Architecture:** Content lives in `src/content` and is consumed by page sections. Shared UI, motion, media, inquiry, and Three.js modules stay independent from route files. Pages compose asymmetric cinematic sections instead of repeated templates.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion, Three.js, @react-three/fiber, @react-three/drei, GSAP, Lenis.

---

## Final File Tree

```text
src/
  app/
    layout.tsx
    page.tsx
    products/page.tsx
    products/[slug]/page.tsx
    scenarios/page.tsx
    scenarios/[slug]/page.tsx
    solutions/page.tsx
    solutions/[slug]/page.tsx
    cases/page.tsx
    cases/[slug]/page.tsx
    news/page.tsx
    about/page.tsx
    contact/page.tsx
    globals.css
  components/
    content/
      CaseStory.tsx
      InquiryPanel.tsx
      ProductCapability.tsx
      ProductGallery.tsx
      ScenarioNarrative.tsx
      SpecNarrative.tsx
    layout/
      Header.tsx
      Footer.tsx
      PageScaffold.tsx
    motion/
      Reveal.client.tsx
      ScrollProgress.client.tsx
    providers/
      LenisProvider.client.tsx
    sections/
      about/
        AboutHero.tsx
        CompanyProof.tsx
        MilestoneSection.tsx
      cases/
        CaseDetailHero.tsx
        CaseIndex.tsx
        CaseProofGrid.tsx
      contact/
        ContactHero.tsx
        ContactMethods.tsx
        InquiryForm.client.tsx
      home/
        HeroSection.tsx
        HeroVisual.client.tsx
        PremiumUAVHeroCanvas.client.tsx
        PremiumUAVStaticVisual.tsx
        BrandManifesto.tsx
        CapabilitySection.tsx
        ProductMatrixSection.tsx
        ApplicationScenesSection.tsx
        TechnologySection.tsx
        FeaturedCasesSection.tsx
        DeliverySection.tsx
        HomeInquirySection.tsx
      products/
        ProductDetailPage.tsx
        ProductIndex.tsx
        ProductSpecSection.tsx
      scenarios/
        ScenarioDetailPage.tsx
        ScenarioIndex.tsx
      solutions/
        SolutionDetailPage.tsx
        SolutionIndex.tsx
    three/
      ThreeFallback.tsx
      ThreeSceneBoundary.client.tsx
      index.ts
    ui/
      Button.tsx
      Container.tsx
      IndustrialCard.tsx
      MediaFrame.tsx
      MetricStrip.tsx
      ProductSpecTable.tsx
      Section.tsx
  content/
    about.ts
    cases.ts
    contact.ts
    home.ts
    index.ts
    media.ts
    navigation.ts
    products.ts
    scenarios.ts
    seo.ts
    site.ts
    solutions.ts
  lib/
    animation/register-gsap.ts
    cn.ts
    content.ts
    motion/reduced-motion.ts
    seo.ts
  scenes/
    three/
      FlightPathScene.client.tsx
      PremiumUAVHeroScene.client.tsx
      ProductExplodedViewScene.client.tsx
      T280PayloadScene.client.tsx
      index.ts
      scene-registry.ts
  styles/
    design-tokens.css
    tokens.ts
  types/
    content.ts
public/
  media/
    products/
    cases/
    scenarios/
    videos/
    certifications/
    contact/
    hizone/
    models/
```

## Development Steps

1. Expand `src/content` with complete migrated company, product, scenario, case, solution, contact, media, and SEO data.
2. Add shared content components for product capability, specs, media, case story, scenario narrative, and inquiry paths.
3. Add Three.js scenes for Hero, product exploded view, and flight path with static/mobile fallback.
4. Build Home page sections in the approved cinematic order.
5. Build Products index and product details from content data.
6. Build Applications, Solutions, Case Studies, About, and Contact pages from content data.
7. Add route-level metadata using centralized SEO helpers.
8. Verify mobile layout, reduced motion, no AI smell, no template patterns, no cheap blue tech.
9. Run `npm.cmd run typecheck` and `npm.cmd run build`.
10. Use browser preview for desktop and mobile screenshots where possible.
```
