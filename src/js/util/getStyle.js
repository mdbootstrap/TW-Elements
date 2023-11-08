const options = {
  property: "color",
  defaultValue: null,
  inherit: true,
};

export const getStyle = (className, customOptions) => {
  const { property, defaultValue, inherit } = { ...options, ...customOptions };

  const element = document.createElement("div");

  element.classList.add(className);
  document.body.appendChild(element);

  const computedStyle = window.getComputedStyle(element);
  const value = computedStyle[property] || defaultValue;

  // Get the computed color value of the parent element
  const parentComputedStyle = window.getComputedStyle(element.parentElement);
  const parentValue = parentComputedStyle[property];

  document.body.removeChild(element);

  // Check if the computed color value is the same as the parent's color value. That means the color is not set on the element itself and it's inherited from the parent element
  if (!inherit && parentValue && value === parentValue) {
    return defaultValue;
  }

  // Return the computed color value or the defaultValue if it's not set
  return value || defaultValue;
};
