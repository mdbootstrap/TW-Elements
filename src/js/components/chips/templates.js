export const getInputField = ({ inputID, labelText }, classes) => {
  return `<div data-te-chips-input-wrapper data-te-input-wrapper-init class="${classes.chipsInputWrapper}">
      <input
          type="text"
          class="${classes.chipsInput}"
          id="${inputID}"
          placeholder="Example label" />
        <label
          for="${inputID}"
          class="${classes.chipsLabel}"
          >${labelText}
        </label>

        <div data-te-input-notch-ref class="${classes.chipsNotchesWrapper}">
        <div class="${classes.chipsNotchesLeading}" data-te-input-notch-leading-ref style="width: 9px;"></div>
        <div class="${classes.chipsNotchesMiddle}" data-te-input-notch-middle-ref style="width: 87.2px;"></div>
        <div class="${classes.chipsNotchesTrailing}" data-te-input-notch-trailing-ref></div>
      </div>
    </div>`;
};

export const getChip = ({ text, iconSVG }, classes) => {
  return `<div data-te-chip-init data-te-ripple-init class="${classes.chipElement}">
    <span data-te-chip-text>${text}</span> 
      <span data-te-chip-close class="${classes.chipCloseIcon}">
        ${iconSVG}
      </span>
  </div>`;
};
