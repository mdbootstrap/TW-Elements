import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";

const psClasses =
  "group/ps overflow-hidden [overflow-anchor:none] [overflow-style:none] touch-none";

const railXClasses =
  "group/x absolute bottom-0 !top-auto h-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-x]/ps:block group-[&.ps--active-x]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:!opacity-90 hover:bg-[#eee] focus:!opacity-90 focus:bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:bg-[#eee] outline-none";
const railXThumbClasses =
  "absolute bottom-[2px] rounded-md h-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover/x:bg-[#999] group-hover/x:h-[11px] group-focus/x:bg-[#999] group-focus/x:h-[11px] group-[&.ps--clicking]/x:bg-[#999] group-[&.ps--clicking]/x:h-[11px] outline-none";

const railYClasses =
  "group/y absolute right-0 !left-auto w-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-y]/ps:block group-[&.ps--active-y]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:!opacity-90 hover:bg-[#eee] focus:!opacity-90 focus:bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:bg-[#eee] outline-none";
const railYThumbClasses =
  "absolute right-[2px] rounded-md w-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_width_.2s_ease-in-out] group-hover/y:bg-[#999] group-hover/y:w-[11px] group-focus/y:bg-[#999] group-focus/y:w-[11px] group-[&.ps--clicking]/y:bg-[#999] group-[&.ps--clicking]/y:w-[11px] outline-none";

const addPerfectScrollbarStyles = (container = document) => {
  const classes = [
    { ps: "ps__rail-x", te: railXClasses },
    { ps: "ps__rail-y", te: railYClasses },
    { ps: "ps__thumb-x", te: railXThumbClasses },
    { ps: "ps__thumb-y", te: railYThumbClasses },
  ];

  classes.forEach((item) => {
    Manipulator.addClass(
      SelectorEngine.findOne(`.${item.ps}`, container),
      item.te
    );
    Manipulator.removeClass(
      SelectorEngine.findOne(`.${item.ps}`, container),
      item.ps
    );
  });
  Manipulator.addClass(container, psClasses);
  Manipulator.removeClass(container, "ps");
};

export default addPerfectScrollbarStyles;
