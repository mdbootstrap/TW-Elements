/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

export const getTimepickerTemplate = (
  {
    format24,
    okLabel,
    cancelLabel,
    headID,
    footerID,
    bodyID,
    pickerID,
    clearLabel,
    inline,
    showClearBtn,
    amLabel,
    pmLabel,
  },
  classes
) => {
  const normalTemplate = `<div id='${pickerID}' class='${
    classes.timepickerWrapper
  }' data-te-timepicker-wrapper>
      <div class="${classes.timepickerContainer}">
        <div class="${classes.timepickerElements}">
        <div id='${headID}' class='${
    classes.timepickerHead
  }' style='padding-right:${format24 ? 50 : 10}px'>
        <div class='${classes.timepickerHeadContent}'>
            <div class="${classes.timepickerCurrentWrapper}">
              <span class="${classes.timepickerCurrentButtonWrapper}">
                <button type='button' class='${
                  classes.timepickerCurrentButton
                }' tabindex="0" data-te-timepicker-active data-te-timepicker-current data-te-timepicker-hour data-te-ripple-init>21</button>
              </span>
              <button type='button' class='${
                classes.timepickerDot
              }' disabled>:</button>
            <span class="${classes.timepickerCurrentButtonWrapper}">
              <button type='button' class='${
                classes.timepickerCurrentButton
              }' tabindex="0" data-te-timepicker-current data-te-timepicker-minute data-te-ripple-init>21</button>
            </span>
            </div>
            ${
              !format24
                ? `<div class="${classes.timepickerModeWrapper}">
                  <button type='button' class="${classes.timepickerModeAm}" tabindex="0" data-te-timepicker-am data-te-timepicker-hour-mode data-te-ripple-init>${amLabel}</button>
                  <button class="${classes.timepickerModePm}" tabindex="0" data-te-timepicker-pm data-te-timepicker-hour-mode data-te-ripple-init>${pmLabel}</button>
                </div>`
                : ""
            }
        </div>
      </div>
      ${
        !inline
          ? `<div id='${bodyID}' class='${
              classes.timepickerClockWrapper
            }' data-te-timepicker-clock-wrapper>
            <div class='${classes.timepickerClock}' data-te-timepicker-clock>
              <span class='${
                classes.timepickerMiddleDot
              }' data-te-timepicker-middle-dot></span>
              <div class='${
                classes.timepickerHandPointer
              }' data-te-timepicker-hand-pointer>
                <div class='${
                  classes.timepickerPointerCircle
                }' data-te-timepicker-circle></div>
              </div>
              ${
                format24
                  ? '<div class="' +
                    classes.timepickerClockInner +
                    '" data-te-timepicker-clock-inner></div>'
                  : ""
              }
            </div>
          </div>`
          : ""
      }
    </div>
    <div id='${footerID}' class='${classes.timepickerFooterWrapper}'>
      <div class="${classes.timepickerFooter}">
        ${
          showClearBtn
            ? `<button type='button' class='${classes.timepickerFooterButton}' data-te-timepicker-clear tabindex="0" data-te-ripple-init>${clearLabel}</button>`
            : ""
        }
        <button type='button' class='${
          classes.timepickerFooterButton
        }' data-te-timepicker-cancel tabindex="0" data-te-ripple-init>${cancelLabel}</button>
        <button type='button' class='${
          classes.timepickerFooterButton
        }' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${okLabel}</button>
      </div>
    </div>
  </div>
</div>`;

  const inlineTemplate = `<div id='${pickerID}' class='${
    classes.timepickerInlineWrapper
  }' data-te-timepicker-wrapper>
        <div class="${classes.timepickerInlineContainer}">
          <div class="${classes.timepickerInlineElements}">
          <div id='${headID}' class='${classes.timepickerInlineHead}'
          style='padding-right:10px'>
          <div class='${classes.timepickerInlineHeadContent}'>
              <div class="${classes.timepickerCurrentWrapper}">
                <span class="${
                  classes.timepickerInlineHourWrapper
                }" data-te-timepicker-inline-hour-icons>
                  <span class="${
                    classes.timepickerInlineIconUp
                  }" data-te-timepicker-icon-up data-te-timepicker-icon-inline-hour>
                    <span class="${classes.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>   
                    </span>
                  </span>
                  <button type='button' class='${
                    classes.timepickerInlineCurrentButton
                  }' data-te-timepicker-hour data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                  <span class="${
                    classes.timepickerInlineIconDown
                  }" data-te-timepicker-icon-inline-hour data-te-timepicker-icon-down>
                    <span class="${classes.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>  
                    </span>
                  </span>
                </span>
                <button type='button' class='${
                  classes.timepickerInlineDot
                }' data-te-timepicker-current-inline disabled>:</button>
              <span class="${classes.timepickerCurrentMinuteWrapper}">
                <span class="${
                  classes.timepickerInlineIconUp
                }" data-te-timepicker-icon-up data-te-timepicker-icon-inline-minute>
                  <span class="${classes.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </span>
                </span>
                <button type='button' class='${
                  classes.timepickerInlineCurrentButton
                }' data-te-timepicker-minute data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                <span class="${
                  classes.timepickerInlineIconDown
                }" data-te-timepicker-icon-inline-minute data-te-timepicker-icon-down>
                  <span class="${classes.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg> 
                  </span>
                </span>
              </span>
              </div>
              ${
                !format24
                  ? `<div class="${classes.timepickerInlineModeWrapper}">
                      <button type='button' class="${classes.timepickerInlineModeAm}" data-te-timepicker-am data-te-timepicker-hour-mode tabindex="0" data-te-ripple-init>${amLabel}</button>
                      <button class="${classes.timepickerInlineModePm}" data-te-timepicker-hour-mode data-te-timepicker-pm tabindex="0" data-te-ripple-init>${pmLabel}</button>
                      <button type='button' class='${classes.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${okLabel}</button>
                    </div>`
                  : ""
              }
              ${
                format24
                  ? `<button class='${classes.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${okLabel}</button>`
                  : ""
              }
          </div>
        </div>
      </div>
    </div>
</div>`;
  return inline ? inlineTemplate : normalTemplate;
};

export const getToggleButtonTemplate = (options, id, classes) => {
  const { iconSVG } = options;

  return `
  <button id="${id}" tabindex="0" type="button" class="${classes.timepickerToggleButton}" data-te-toggle="timepicker" data-te-timepicker-toggle-button data-te-timepicker-icon>
    ${iconSVG}
  </button>
`;
};
