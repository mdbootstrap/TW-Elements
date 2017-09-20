import { PerfectScrollbarOptions } from './options';
import { Scrollbar } from './scrollbar';
export default class PerfectScrollbar {
    el: HTMLElement;
    scrollbarX: Scrollbar;
    scrollbarY: Scrollbar;
    private emulations;
    private options;
    constructor(el: HTMLElement, options?: {
        [K in keyof PerfectScrollbarOptions]?: PerfectScrollbarOptions[K];
    });
    readonly scrollbars: Scrollbar[];
    readonly document: Document;
    update(): void;
    destroy(): void;
}
export { PerfectScrollbarOptions };
