import EventHandler from "../dom/event-handler";
import { getElementFromSelector, isDisabled } from "./index";
let addedEventsList = [];

const enableDismissTrigger = (component, method = "hide") => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;

  if (addedEventsList.includes(name)) {
    return;
  }

  addedEventsList.push(name);

  EventHandler.on(
    document,
    clickEvent,
    `[data-twe-${name}-dismiss]`,
    function (event) {
      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      const target =
        getElementFromSelector(this) ||
        this.closest(`.${name}`) ||
        this.closest(`[data-twe-${name}-init]`);

      if (!target) {
        return;
      }
      const instance = component.getOrCreateInstance(target);

      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
      instance[method]();
    }
  );
};

export { enableDismissTrigger };
