// TWE FREE COMPONENTS
import Button from "./free/components/button";
import Dropdown from "./free/components/dropdown";
import Collapse from "./free/components/collapse";
import Offcanvas from "./free/components/offcanvas";
import Carousel from "./free/components/carousel";
import Popover from "./free/components/popover";
import ScrollSpy from "./free/navigation/scrollspy";
import Tab from "./free/navigation/tab";
import Tooltip from "./free/components/tooltip";
import Input from "./free/forms/input";
import Ripple from "./free/methods/ripple";
import Modal from "./free/components/modal";
import initTWE from "./autoinit/index.free";

const twe = {
  Button,
  Dropdown,
  Collapse,
  Offcanvas,
  Carousel,
  Popover,
  ScrollSpy,
  Tab,
  Tooltip,
  Input,
  Ripple,
  Modal,
};

initTWE(twe);

export {
  Button,
  Dropdown,
  Collapse,
  Offcanvas,
  Carousel,
  Popover,
  ScrollSpy,
  Tab,
  Tooltip,
  Input,
  Ripple,
  Modal,
  initTWE,
};
