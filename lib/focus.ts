/** Filter out controls that are hidden, detached, or inside an inert surface. */
export function canFocus(element: HTMLElement | null): element is HTMLElement {
  return (
    !!element?.isConnected &&
    !element.closest("[inert]") &&
    !!element.getClientRects().length &&
    getComputedStyle(element).visibility !== "hidden"
  );
}
