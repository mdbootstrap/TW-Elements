declare namespace PerfectScrollbar {
  export interface Options {
    handlers?: string[];
    wheelSpeed?: number;
    wheelPropagation?: boolean;
    swipePropagation?: boolean;
    swipeEasing?: boolean;
    minScrollbarLength?: number;
    maxScrollbarLength?: number;
    useBothWheelAxes?: boolean;
    suppressScrollX?: boolean;
    suppressScrollY?: boolean;
    scrollXMarginOffset?: number;
    scrollYMarginOffset?: number;
  }
}

declare class PerfectScrollbar {
  constructor(element: string | HTMLElement, options?: PerfectScrollbar.Options);

  update(): void;
  destroy(): void;

  reach: { x: 'start' | 'end' | null, y: 'start' | 'end' | null };
}

export default PerfectScrollbar;
