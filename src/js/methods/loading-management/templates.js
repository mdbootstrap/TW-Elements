import Manipulator from "../../dom/manipulator";
import { element } from "../../util/index";

export function getBackdropTemplate({ backdropID }, classes) {
  const backdrop = element("div");

  Manipulator.addClass(backdrop, classes.backdrop);
  backdrop.id = backdropID;

  return backdrop;
}
