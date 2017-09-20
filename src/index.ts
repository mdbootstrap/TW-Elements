import { defaultOptions, PerfectScrollbarOptions } from './options';
import { ScrollEmulation } from './emulations/base';
import { Scrollbar } from './scrollbar';

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
  scrollbarX: Scrollbar;
  scrollbarY: Scrollbar;

  private emulations: ScrollEmulation[];
  private options: PerfectScrollbarOptions;

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

    this.scrollbarX = new Scrollbar('x', this.options);
    this.scrollbarY = new Scrollbar('y', this.options);

    this.el.classList.add('ps');

    this.emulations = this.options.handlers.map(handler => {
      const Emulation = emulationDict[handler];
      return new Emulation(this);
    });

    this.el.addEventListener('scroll', this.update);

    this.update();
  }

  get scrollbars() {
    return [this.scrollbarX, this.scrollbarY];
  }

  get document() {
    return this.el.ownerDocument || document;
  }

  update() {
    this.scrollbars.forEach(scrollbar => {
      if (!scrollbar.isInstalledAt(this.el)) {
        scrollbar.appendTo(this.el);
      }
    });
  }

  destroy() {
    this.el.removeEventListener('scroll', this.update);

    // destroy scrollbars
    this.scrollbars.forEach(scrollbar => scrollbar.destroy());

    // destory emulations
    this.emulations.forEach(emu => emu.destroy());
  }
}

export { PerfectScrollbarOptions };
