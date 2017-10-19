const cls = {
  main: 'ps',
  element: {
    thumb: x => `ps__thumb-${x}`,
    rail: x => `ps__rail-${x}`,
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    active: x => `ps--active-${x}`,
    scrolling: x => `ps--scrolling-${x}`,
  },
};

export default cls;

/*
 * Helper methods
 */
const scrollingClassTimeout = { x: null, y: null };
export function setScrollingClass(i, x) {
  const classList = i.element.classList;
  const className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }

  // 1s for threshold
  scrollingClassTimeout[x] = setTimeout(
    () => classList.remove(className),
    i.settings.scrollingThreshold
  );
}
