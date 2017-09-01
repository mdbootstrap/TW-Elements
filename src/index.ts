import {defaultOptions, PerfectScrollbarOptions} from './options';
import {ScrollEmulation} from './emulations/base';

export class PerfectScrollbar {
  el: HTMLElement;
  options: PerfectScrollbarOptions;
  private emulations: ScrollEmulation[];

  constructor(
    el: HTMLElement,
    options?: {
      [K in keyof PerfectScrollbarOptions]?: PerfectScrollbarOptions[K];
    },
  ) {
    // method binds
    this.update = this.update.bind(this);

    this.el = el;
    this.options = { ...defaultOptions(), ...options };

    this.el.classList.add('ps');

    this.emulations = []; // FIXME: from options.handlers

    this.el.addEventListener('scroll', this.update);

    this.update();
  }

  update() {
    // FIXME
  }

  destroy() {
    this.el.removeEventListener('scroll', this.update);
  }
}

export {PerfectScrollbarOptions};
