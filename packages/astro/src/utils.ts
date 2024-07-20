import { AstroGlobal } from "astro";

export function getCurrentPath(astro: AstroGlobal) {
  return new URL(astro.request.url).pathname;
}

export function removeFalseyValues<T>(obj: T): Partial<T> {
  const filteredItems = Object.entries(obj).filter(([, value]) => value);

  return Object.fromEntries(filteredItems) as Partial<T>;
}
