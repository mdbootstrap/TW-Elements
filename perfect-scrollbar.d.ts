interface PerfectScrollbarOptions {
  wheelSpeed?: number;
  wheelPropagation?: boolean;
  swipePropagation?: boolean;
  minScrollbarLength?: number;
  maxScrollbarLength?: number;
  useBothWheelAxes?: boolean;
  useKeyboard?: boolean;
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  scrollXMarginOffset?: number;
  scrollYMarginOffset?: number;
}

interface PerfectScrollbar {
  initialize(container: HTMLElement, options?: PerfectScrollbarOptions);
  update(container: HTMLElement);
  destroy(container: HTMLElement);
}

interface JQuery {
  perfectScrollbar(options?: PerfectScrollbarOptions): JQuery;
}

declare var ps: PerfectScrollbar;

declare module "perfect-scrollbar" {
  export = ps;
}
