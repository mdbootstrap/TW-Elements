import BaseComponent from "../../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "button";

const CLASS_NAME_ACTIVE = "active";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Button extends BaseComponent {
  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle(CLASS_NAME_ACTIVE)
    );
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);

      if (config === "toggle") {
        data[config]();
      }
    });
  }
}

export default Button;
