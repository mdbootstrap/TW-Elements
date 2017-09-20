import { PerfectScrollbarOptions } from './options';
export declare class Scrollbar {
    axis: 'x' | 'y';
    private options;
    railEl: HTMLDivElement;
    thumbEl: HTMLDivElement;
    constructor(axis: 'x' | 'y', options: PerfectScrollbarOptions);
    isInstalledAt(container: HTMLElement): boolean;
    appendTo(container: HTMLElement): void;
    destroy(): void;
}
