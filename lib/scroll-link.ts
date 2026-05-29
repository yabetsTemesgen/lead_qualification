/** Matches fixed header height + breathing room (`scroll-padding-top` on `html`). */
export const HEADER_SCROLL_OFFSET = 88;

export function inPageScrollLinkProps(href: string): Record<string, string> {
  if (!href.startsWith("#")) {
    return {};
  }

  return {
    "data-scroll-to": "",
    "data-scroll-to-href": href,
    // Lenis adds offset to the target scroll position — negative keeps content below the navbar.
    "data-scroll-to-offset": String(-HEADER_SCROLL_OFFSET),
  };
}
