import PerfectScrollbar from '../index';
export declare abstract class ScrollEmulation {
    protected ps: PerfectScrollbar;
    constructor(ps: PerfectScrollbar);
    abstract init(): void;
    abstract destroy(): void;
}
