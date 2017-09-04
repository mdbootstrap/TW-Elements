export function getStyle(element: Element, styleName: string): string {
  return getComputedStyle(element).getPropertyValue(styleName);
}

export function getNumStyle(element: Element, styleName: string): number {
  return parseInt(getStyle(element, styleName), 10) || 0;
}

export function setStyle(
  element: HTMLElement,
  obj: { [key: string]: string | number },
) {
  for (const key in obj) {
    let val = obj[key];
    if (typeof val === 'number') {
      val = `${val}px`;
    }
    element.style.setProperty(key, val);
  }
}

export function matches(element: HTMLElement, query: string): boolean {
  if (typeof element.matches === 'function') {
    return element.matches(query);
  } else {
    // must be IE11 and Edge
    return element.msMatchesSelector(query);
  }
}

export function remove(element: HTMLElement) {
  if (typeof element.remove === 'function') {
    element.remove();
  } else if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}
