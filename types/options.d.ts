export interface PerfectScrollbarOptions {
    handlers: Array<'click-rail' | 'drag-scrollbar' | 'keyboard' | 'wheel' | 'touch' | 'selection'>;
    maxScrollbarLength: number | null;
    minScrollbarLength: number | null;
    scrollXMarginOffset: number;
    scrollYMarginOffset: number;
    suppressScrollX: boolean;
    suppressScrollY: boolean;
    swipePropagation: boolean;
    swipeEasing: boolean;
    useBothWheelAxes: boolean;
    wheelPropagation: boolean;
    wheelSpeed: number;
}
export declare const defaultOptions: () => PerfectScrollbarOptions;
