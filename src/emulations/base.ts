import PerfectScrollbar from '../index';

export abstract class ScrollEmulation {
  constructor(protected ps: PerfectScrollbar) {
    this.init();
  }

  abstract init(): void;
  abstract destroy(): void;
}
