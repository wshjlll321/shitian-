import { caseStudies } from "@/content/cases";
import { mediaAssets } from "@/content/media";
import { newsArticles } from "@/content/news";
import { products } from "@/content/products";
import { scenarios } from "@/content/scenarios";
import type { CaseStudy, MediaAsset, NewsArticle, Product, Scenario } from "@/types/content";

function isDefined<T>(item: T | undefined): item is T {
  return item !== undefined;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductByModel(model: string) {
  return products.find((product) => product.model === model);
}

export function getScenarioBySlug(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}

export function getCaseBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getNewsBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}

export function getCasesBySlugs(slugs: string[]) {
  return slugs.map(getCaseBySlug).filter(isDefined) satisfies CaseStudy[];
}

export function getProductsByModels(models: string[]) {
  return models.map(getProductByModel).filter(isDefined) satisfies Product[];
}

export function getScenariosBySlugs(slugs: string[]) {
  return slugs.map(getScenarioBySlug).filter(isDefined) satisfies Scenario[];
}

export function getMediaById(id: string) {
  return mediaAssets.find((asset) => asset.id === id);
}

export function getMediaByIds(ids: string[]) {
  return ids.map(getMediaById).filter(isDefined) satisfies MediaAsset[];
}

export function getNewsBySlugs(slugs: string[]) {
  return slugs.map(getNewsBySlug).filter(isDefined) satisfies NewsArticle[];
}
