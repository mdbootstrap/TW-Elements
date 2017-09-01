import { defaultOptions, PerfectScrollbarOptions } from './options';
import { ScrollEmulation } from './emulations/base';

// FIXME
class DummyEmulation extends ScrollEmulation {
  init() {}
  destroy() {}
}

// FIXME
const emulationDict = {
  'click-rail': DummyEmulation,
  'drag-scrollbar': DummyEmulation,
  keyboard: DummyEmulation,
  wheel: DummyEmulation,
  touch: DummyEmulation,
  selection: DummyEmulation,
};

export class PerfectScrollbar {
  el: HTMLElement;
  options: PerfectScrollbarOptions;
  private emulations: ScrollEmulation[];

  constructor(
    el: HTMLElement,
    options?: {
      [K in keyof PerfectScrollbarOptions]?: PerfectScrollbarOptions[K]
    },
  ) {
    // method binds
    this.update = this.update.bind(this);

    this.el = el;
    this.options = { ...defaultOptions(), ...options };

    this.el.classList.add('ps');

    this.emulations = this.options.handlers.map(handler => {
      const Emulation = emulationDict[handler];
      return new Emulation(this);
    });

    this.el.addEventListener('scroll', this.update);

    this.update();
  }

  update() {
    // FIXME
  }

  destroy() {
    this.el.removeEventListener('scroll', this.update);

    // destory emulations
    this.emulations.forEach(emu => emu.destroy());
    this.emulations = [];
  }
}

export { PerfectScrollbarOptions };
