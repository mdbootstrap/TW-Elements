/* eslint-disable import/prefer-default-export */
/* eslint-disable indent */

export const getTimepickerTemplate = ({
  okLabel,
  cancelLabel,
  headID,
  footerID,
  bodyID,
  pickerID,
  clearLabel,
  showClearBtn,
  amLabel,
  pmLabel,
}) => {
  const normalTemplate = `<div id='${pickerID}' class='timepicker-wrapper h-full flex items-center justify-center flex-col fixed'>
      <div class="flex items-center justify-center flex-col timepicker-container">
        <div class="flex flex-col timepicker-elements justify-around">
        <div id='${headID}' class='timepicker-head flex flex-row items-center justify-center'>
        <div class='timepicker-head-content flex w-100 justify-evenly'>
            <div class="timepicker-current-wrapper">
              <span class="relative h-100">
                <button type='button' class='timepicker-current timepicker-hour active ripple' tabindex="0">21</button>
              </span>
              <button type='button' class='timepicker-dot' disabled>:</button>
            <span class="relative h-100">
              <button type='button' class='timepicker-current timepicker-minute ripple' tabindex="0">21</button>
            </span>
            </div>
            <div class="flex flex-col justify-center timepicker-mode-wrapper">
              <button type='button' class="timepicker-hour-mode timepicker-am ripple" tabindex="0">${amLabel}</button>
              <button class="timepicker-hour-mode timepicker-pm ripple" tabindex="0">${pmLabel}</button>
            </div>
        </div>
      </div>
      <div id='${bodyID}' class='timepicker-clock-wrapper flex justify-center flex-col items-center'>
        <div class='timepicker-clock'>
          <span class='timepicker-middle-dot absolute'></span>
          <div class='timepicker-hand-pointer absolute'>
            <div class='timepicker-circle absolute'></div>
          </div>
        </div>
      </div>
    </div>
    <div id='${footerID}' class='timepicker-footer'>
      <div class="w-full flex justify-between">
        ${
          showClearBtn
            ? `<button type='button' class='timepicker-button timepicker-clear ripple' tabindex="0">${clearLabel}</button>`
            : ''
        }
        <button type='button' class='timepicker-button timepicker-cancel ripple' tabindex="0">${cancelLabel}</button>
        <button type='button' class='timepicker-button timepicker-submit ripple' tabindex="0">${okLabel}</button>
      </div>
    </div>
  </div>
</div>`;

  return normalTemplate;
};

export const getToggleButtonTemplate = (options, id) => {
  const { iconClass } = options;

  return `
  <button id="${id}" tabindex="0" type="button" class="timepicker-toggle-button" data-mdb-toggle="timepicker"  >
    <i class="${iconClass}"></i>
  </button>
`;
};
