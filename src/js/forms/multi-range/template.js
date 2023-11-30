const getConnectsTemplate = (classes, attributes) => {
  return `<div class="${classes.connectContainer}" ${attributes}>
  <div class="${classes.connect}"></div>
  </div>`;
};

const getHandleTemplate = (classes, attributes) => {
  return `<div class="${classes.hand}" ${attributes}>
    <span></span>
  </div>`;
};

const getTooltipTemplate = (classes, attributes) => {
  return `
    <span class="${classes.tooltip}" ${attributes}>
      <span class="${classes.tooltipValue}"></span>
    </span>
    `;
};

export { getConnectsTemplate, getHandleTemplate, getTooltipTemplate };
