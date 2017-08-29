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
  theme?: string;
}

interface PerfectScrollbar {
  initialize(container: HTMLElement, options?: PerfectScrollbarOptions): void;
  update(container: HTMLElement): void;
  destroy(container: HTMLElement): void;
}

interface JQuery {
  perfectScrollbar(options?: PerfectScrollbarOptions): JQuery;
  perfectScrollbar(options: string): JQuery;
}

declare var ps: PerfectScrollbar;

declare module "perfect-scrollbar" {
  export = ps;
}
