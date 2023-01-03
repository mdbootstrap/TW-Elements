/* eslint-disable import/prefer-default-export */
/* eslint-disable indent */

export const getTimepickerTemplate = ({
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
}) => {
  const normalTemplate = `<div id='${pickerID}' class='touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col fixed' data-te-timepicker-wrapper>
      <div class="flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]">
        <div class="flex flex-col min-w-[310px] min-h-[325px] bg-white rounded-t-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:rounded-bl-lg min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape::min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around">
        <div id='${headID}' class='bg-[#3b71ca] h-[100px] rounded-t-lg pr-[24px] pl-[50px] py-[10px] min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center' style='padding-right:${format24 ? 50 : 0}px'>
        <div class='min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly'>
            <div class="[direction:ltr] rtl:[direction:rtl]">
              <span class="relative h-full">
                <button type='button' class='text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ripple opacity-[.54]' tabindex="0" data-te-timepicker-active data-te-timepicker-current data-te-timepicker-hour>21</button>
              </span>
              <button type='button' class='font-light leading-[1.2] tracking-[-0.00833em] text-[3.75rem] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal' disabled>:</button>
            <span class="relative h-full">
              <button type='button' class='text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em] text-white opacity-[.54] border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ripple' tabindex="0" data-te-timepicker-current data-te-timepicker-minute>21</button>
            </span>
            </div>
            ${
              !format24
              ? `<div class="flex flex-col justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row" data-te-timepicker-mode-wrapper>
                  <button type='button' class="p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ripple" tabindex="0" data-te-timepicker-am data-te-timepicker-hour-mode>${amLabel}</button>
                  <button class="p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ripple" tabindex="0" data-te-timepicker-pm data-te-timepicker-hour-mode>${pmLabel}</button>
                </div>`
              : ''
            }
        </div>
      </div>
      ${
        !inline
        ? `<div id='${bodyID}' class='min-w-[310px] max-w-[325px] min-h-[305px] overflow-x-hidden h-full flex justify-center flex-col items-center' data-te-timepicker-clock-wrapper>
            <div class='relative rounded-[100%] w-[260px] h-[260px] cursor-default my-0 mx-auto bg-[#00000012]' data-te-timepicker-clock>
              <span class='top-1/2 left-1/2 w-[6px] h-[6px] -translate-y-1/2 -translate-x-1/2 rounded-[50%] bg-[#3b71ca] absolute' data-te-timepicker-middle-dot></span>
              <div class='bg-[#3b71ca] bottom-1/2 h-2/5 left-[calc(50%-1px)] rtl:!left-auto origin-[center_bottom_0] rtl:!origin-[50%_50%_0] w-[2px] absolute' data-te-timepicker-hand-pointer>
                <div class='-top-[21px] -left-[15px] w-[4px] border-[14px] border-solid border-[#3b71ca] h-[4px] box-content rounded-[100%] absolute' data-te-timepicker-circle></div>
              </div>
              ${format24 ? '<div class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-[100%]" data-te-timepicker-clock-inner></div>' : ''}
            </div>
          </div>`
          : ''
      }
    </div>
    <div id='${footerID}' class='rounded-b-lg flex justify-between items-center w-full h-[56px] px-[12px] bg-white'>
      <div class="w-full flex justify-between">
        ${
          showClearBtn
            ? `<button type='button' class='text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none ripple' data-te-timepicker-clear tabindex="0">${clearLabel}</button>`
            : ''
        }
        <button type='button' class='text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none ripple' data-te-timepicker-cancel tabindex="0">${cancelLabel}</button>
        <button type='button' class='text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none ripple' data-te-timepicker-submit tabindex="0">${okLabel}</button>
      </div>
    </div>
  </div>
</div>`;

const inlineTemplate = `<div id='${pickerID}' class='timepicker-wrapper touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col rounded-lg timepicker-wrapper-inline' data-te-timepicker-wrapper>
        <div class="flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] timepicker-container">
          <div class="flex flex-col min-h-[auto] min-w-[310px] bg-white rounded-t-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:rounded-bl-lg min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape::min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto timepicker-elements justify-around timepicker-elements-inline">
          <div id='${headID}' class='timepicker-head bg-[#3b71ca] h-[100px] rounded-t-lg min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center p-0 rounded-b-lg timepicker-head-inline'
          style='padding-right:0px'>
          <div class='timepicker-head-content min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly items-center'>
              <div class="timepicker-current-wrapper [direction:ltr] rtl:[direction:rtl]">
                <span class="relative h-full timepicker-inline-hour-icons !opacity-100" data-te-timepicker-inline-hour-icons>
                  <i class="fas fa-chevron-up absolute text-white timepicker-icon-up -top-[35px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center timepicker-icon-inline-hour" data-te-timepicker-icon-up data-te-timepicker-icon-inline-hour></i>
                  <button type='button' class='timepicker-current font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal !opacity-100 cursor-pointer focus:bg-[#00000026] hover:outline-none focus:outline-none timepicker-hour active ripple text-[2.5rem] hover:bg-[unset] timepicker-current-inline' data-te-timepicker-hour data-te-timepicker-current data-te-timepicker-current-inline tabindex="0">21</button>
                  <i class="fas fa-chevron-down absolute text-white timepicker-icon-down -bottom-[47px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center timepicker-icon-inline-hour" data-te-timepicker-icon-inline-hour data-te-timepicker-icon-down></i>
                </span>
                <button type='button' class='timepicker-dot font-light leading-[1.2] tracking-[-0.00833em] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal text-[2.5rem] timepicker-current-inline' data-te-timepicker-current-inline disabled>:</button>
              <span class="relative h-full  timepicker-inline-minutes-icons">
                <i class="fas fa-chevron-up absolute text-white timepicker-icon-up -top-[35px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center timepicker-icon-inline-minute" data-te-timepicker-icon-up data-te-timepicker-icon-inline-minute></i>
                <button type='button' class='timepicker-current font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal !opacity-100 cursor-pointer focus:bg-[#00000026] hover:outline-none focus:outline-none timepicker-minute ripple hover:bg-[unset] text-[2.5rem] timepicker-current-inline' data-te-timepicker-minute data-te-timepicker-current data-te-timepicker-current-inline tabindex="0">21</button>
                <i class="fas fa-chevron-down absolute text-white timepicker-icon-down -bottom-[47px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center timepicker-icon-inline-minute" data-te-timepicker-icon-inline-minute data-te-timepicker-icon-down></i>
              </span>
              </div>
              ${
                !format24
                  ? `<div class="flex justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row timepicker-mode-wrapper">
                      <button type='button' class="timepicker-hour-mode hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer timepicker-am ripple mr-2 ml-6" data-te-timepicker-am data-te-timepicker-hour-mode tabindex="0">${amLabel}</button>
                      <button class="timepicker-hour-mode hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer timepicker-pm ripple" data-te-timepicker-hour-mode data-te-timepicker-pm tabindex="0">${pmLabel}</button>
                      <button type='button' class='timepicker-button hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none text-[0.8rem] box-border font-medium leading-[40px] tracking-[.1rem] uppercase border-none bg-transparent [transition:background-color_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,box-shadow_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,border_250ms_cubic-bezier(0.4,0,0.2,1)_0ms] outline-none timepicker-submit timepicker-submit-inline rounded-[100%] h-[48px] min-w-[48px] inline-block ml-[30px] text-white ripple py-1 px-2 mb-0' data-te-timepicker-submit tabindex="0">${okLabel}</button>
                    </div>`
                  : ''
              }
              ${
                format24
                  ? `<button class='timepicker-button hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none text-[0.8rem] box-border font-medium leading-[40px] tracking-[.1rem] uppercase border-none bg-transparent [transition:background-color_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,box-shadow_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,border_250ms_cubic-bezier(0.4,0,0.2,1)_0ms] outline-none timepicker-submit timepicker-submit-inline rounded-[100%] h-[48px] min-w-[48px] inline-block ml-[30px] text-white ripple py-1 px-2 mb-0' data-te-timepicker-submit tabindex="0">${okLabel}</button>`
                  : ''
              }
          </div>
        </div>
      </div>
    </div>
</div>`
;

  return inline ? inlineTemplate : normalTemplate;
};

export const getToggleButtonTemplate = (options, id) => {
  const { iconClass } = options;

  return `
  <button id="${id}" tabindex="0" type="button" class="absolute outline-none border-none bg-transparent right-[10px] top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[300ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer hover:text-[#3b71ca] focus:text-[#3b71ca]" data-te-toggle="timepicker" data-te-timepicker-toggle-button>
    <i class="${iconClass}"></i>
  </button>
`;
};
