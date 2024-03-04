import SelectorEngine from "../dom/selector-engine";
import jqueryInit from "./jqueryInit";

// key => component NAME constant
// name => component exported by name
import InitRegister from "./Register";

const register = new InitRegister();
let _defaultInitSelectors;

const getComponentData = (component) => {
  return _defaultInitSelectors[component.NAME] || null;
};

const initComponent = (component, options) => {
  if (
    !component ||
    (!options.allowReinits && register.isInited(component.NAME))
  ) {
    return;
  }

  register.add(component.NAME);

  const thisComponent = getComponentData(component);
  const isToggler = thisComponent?.isToggler || false;

  jqueryInit(component);

  if (thisComponent?.advanced) {
    thisComponent?.advanced(component, thisComponent?.selector);
    return;
  }

  if (isToggler) {
    thisComponent?.callback(component, thisComponent?.selector);

    return;
  }

  SelectorEngine.find(thisComponent?.selector).forEach((element) => {
    let instance = component.getInstance(element);
    if (!instance) {
      instance = new component(element);
      if (thisComponent?.onInit) {
        instance[thisComponent.onInit]();
      }
    }
  });
};

// const init = (components, options) => {
//   components.forEach((component) => initComponent(component, options));
// };

const defaultOptions = {
  allowReinits: false,
  checkOtherImports: false,
};

export class InitTWE {
  constructor(defaultInitSelectors) {
    _defaultInitSelectors = defaultInitSelectors;
  }

  init = (components, options) => {
    components.forEach((component) => initComponent(component, options));
  };

  initTWE = (components, options) => {
    const initOptions = { ...defaultOptions, ...options };

    const componentList = Object.keys(_defaultInitSelectors).map((element) => {
      const requireAutoinit = Boolean(
        document.querySelector(_defaultInitSelectors[element].selector)
      );
      if (requireAutoinit) {
        const component = components[_defaultInitSelectors[element].name];
        if (
          !component &&
          !register.isInited(element) &&
          initOptions.checkOtherImports
        ) {
          console.warn(
            `Please import ${_defaultInitSelectors[element].name} from "tw-elements" package and add it to a object parameter inside "initTWE" function`
          );
        }
        return component;
      }
    });

    this.init(componentList, initOptions);
  };
}

export default InitTWE;
