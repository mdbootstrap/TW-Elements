export const DPL = (function () {
  function defineComponent({ selector, template, mounted = () => {} }) {
    return { selector, template, mounted };
  }

  function run({ components, userData }) {
    components.forEach(({ selector, template, mounted }) => {
      const selectors = Array.isArray(selector) ? selector : [selector];
      selectors.forEach((s) => {
        document.querySelectorAll(s).forEach((placeholder) => {
          const dynamicElementContent = typeof template === 'string' ? template : template(userData);
          const temp = document.createElement('template');
          temp.innerHTML = dynamicElementContent;
          placeholder.appendChild(temp.content);

          mounted(userData);
        });
      });
    });

    const event = new CustomEvent('dpl_loaded', {
      bubbles: true,
      cancelable: true,
      detail: userData,
    });
    document.dispatchEvent(event);
  }

  return {
    defineComponent,
    run,
  };
})();
