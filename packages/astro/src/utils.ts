import { AstroGlobal } from "astro";

export function getCurrentPath(astro: AstroGlobal) {
  return new URL(astro.request.url).pathname;
}
