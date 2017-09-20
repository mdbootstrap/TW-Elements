import { PerfectScrollbarOptions } from './options';
import { remove } from './lib/dom';

export class Scrollbar {
  railEl: HTMLDivElement = document.createElement('div');
  thumbEl: HTMLDivElement = document.createElement('div');

  constructor(
    public axis: 'x' | 'y',
    private options: PerfectScrollbarOptions,
  ) {
    this.railEl.className = `ps_scrollbar--${this.axis}-rail`;
    this.thumbEl.className = `ps_scrollbar--${this.axis}`;
  }

  isInstalledAt(container: HTMLElement): boolean {
    return this.railEl.parentElement === container;
  }

  appendTo(container: HTMLElement) {
    this.railEl.appendChild(this.thumbEl);
    container.appendChild(this.railEl);
  }

  destroy() {
    remove(this.thumbEl);
    remove(this.railEl);
  }
}
