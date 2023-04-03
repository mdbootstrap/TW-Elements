/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import Button from "./components/button";
import Dropdown from "./components/dropdown";
import Collapse from "./components/collapse";
import Offcanvas from "./components/offcanvas";
import Alert from "./components/alert";
import Carousel from "./components/carousel";
import Modal from "./components/modal";
import Popover from "./components/popover";
import ScrollSpy from "./navigation/scrollspy";
import Tab from "./navigation/tab";
import Tooltip from "./components/tooltip";
import Toast from "./components/toast";
import Input from "./forms/input";
import Animate from "./content-styles/animate";
import Ripple from "./methods/ripple";
import Datepicker from "./forms/datepicker";
import Timepicker from "./forms/timepicker";
import Sidenav from "./navigation/sidenav";
import Stepper from "./components/stepper";
import Select from "./forms/select";
import ChipsInput from "./components/chips";
import Chip from "./components/chips/chip";
import Chart from "./data/chart/charts";
import initTE from "./autoinit/index";

const te = {
  Animate,
  Alert,
  Button,
  ChipsInput,
  Chip,
  Dropdown,
  Carousel,
  Collapse,
  Offcanvas,
  Modal,
  Popover,
  ScrollSpy,
  Select,
  Tab,
  Toast,
  Tooltip,
  Ripple,
  Datepicker,
  Timepicker,
  Sidenav,
  Stepper,
  Input,
  Chart,
};

initTE(te);

export {
  Animate,
  Alert,
  Button,
  ChipsInput,
  Chip,
  Dropdown,
  Carousel,
  Collapse,
  Offcanvas,
  Modal,
  Popover,
  ScrollSpy,
  Select,
  Tab,
  Toast,
  Tooltip,
  Ripple,
  Datepicker,
  Timepicker,
  Sidenav,
  Stepper,
  Input,
  Chart,
  initTE,
};
