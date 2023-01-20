import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";

const psClasses =
  "group/ps overflow-hidden [overflow-anchor:none] [overflow-style:none] touch-none";

const railXClasses =
  "group absolute bottom-0 !top-auto h-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-x]/ps:block group-[&.ps--active-x]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:opacity-60 hover:bg-[#eee] focus:opacity-60 focus:bg-[#eee] [&.ps--clicking]:opacity-60 [&.ps--clicking]:bg-[#eee]";
const railXThumbClasses =
  "absolute bottom-[2px] rounded-md h-1.5 bg-[#aaa] [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover:bg-[#999] group-hover:h-[11px] group-focus:bg-[#999] group-focus:h-[11px] group-[&.ps--clicking]:bg-[#999] group-[&.ps--clicking]:h-[11px]";

const railYClasses =
  "group absolute right-0 !left-auto w-[15px] hidden opacity-0 [transition:background-color_.2s_linear,_opacity_.2s_linear] motion-reduce:transition-none group-[&.ps--active-y]/ps:block group-[&.ps--active-y]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:opacity-60 hover:bg-[#eee] focus:opacity-60 focus:bg-[#eee] [&.ps--clicking]:opacity-60 [&.ps--clicking]:bg-[#eee]";
const railYThumbClasses =
  "absolute right-[2px] rounded-md w-1.5 bg-[#aaa] [transition:background-color_.2s_linear,_width_.2s_ease-in-out] group-hover:bg-[#999] group-hover:h-[11px] group-focus:bg-[#999] group-focus:h-[11px] group-[&.ps--clicking]:bg-[#999] group-[&.ps--clicking]:h-[11px]";

const addPerfectScrollbarStyles = (container = document) => {
  Manipulator.addMultiClass(container, psClasses);
  Manipulator.removeClass(container, "ps");

  const classes = [
    { ps: "ps__rail-x", te: railXClasses },
    { ps: "ps__thumb-x", te: railXThumbClasses },
    { ps: "ps__rail-y", te: railYClasses },
    { ps: "ps__thumb-y", te: railYThumbClasses },
  ];

  classes.forEach((item) => {
    Manipulator.addMultiClass(
      SelectorEngine.findOne(`.${item.ps}`, container),
      item.te
    );
    Manipulator.removeClass(
      SelectorEngine.findOne(`.${item.ps}`, container),
      item.ps
    );
  });
};

export default addPerfectScrollbarStyles;
