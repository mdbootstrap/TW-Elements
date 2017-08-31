export interface PerfectScrollbarOptions {
  handlers: Array<'click-rail' | 'drag-scrollbar' | 'keyboard' | 'wheel' | 'touch' | 'selection'>,
  maxScrollbarLength?: number,
  minScrollbarLength?: number,
  scrollXMarginOffset: number,
  scrollYMarginOffset: number,
  suppressScrollX: boolean,
  suppressScrollY: boolean,
  swipePropagation: boolean,
  swipeEasing: boolean,
  useBothWheelAxes: boolean,
  wheelPropagation: boolean,
  wheelSpeed: number,
}

export const defaultOptions = (): PerfectScrollbarOptions => ({
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
});
