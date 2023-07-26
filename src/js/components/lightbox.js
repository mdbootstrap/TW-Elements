/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { element, typeCheckConfig } from "../util/index";
import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "lightbox";
const DATA_KEY = "te.lightbox";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const SELECTOR_ATTR_LIGHTBOX = "[data-te-lightbox-init]";
const SELECTOR_ATTR_TOGGLE = `${SELECTOR_ATTR_LIGHTBOX} img:not([data-te-lightbox-disabled])`;
const ATTR_LIGHTBOX_CAPTION = `data-te-lightbox-caption`;
const ATTR_LIGHTBOX_DISABLED = `data-te-lightbox-disabled`;
const ATTR_STATE_ACTIVE = `data-te-lightbox-active`;

const prevIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
</svg>
`;
const nextIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg>
`;
const showFullscreenIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
</svg>
`;
const hideFullscreenIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
</svg>
`;
const zoomInIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
</svg>
`;
const zoomOutIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
</svg>
`;
const closeIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`;

const OPTIONS_TYPE = {
  container: "string",
  zoomLevel: "(number|string)",
  prevIconTemplate: "string",
  nextIconTemplate: "string",
  showFullscreenIconTemplate: "string",
  hideFullscreenIconTemplate: "string",
  zoomInIconTemplate: "string",
  closeIconTemplate: "string",
  zoomOutIconTemplate: "string",
  spinnerContent: "string",
};

const DEFAULT_OPTIONS = {
  container: "body",
  zoomLevel: 1,
  prevIconTemplate: prevIconTemplate,
  nextIconTemplate: nextIconTemplate,
  showFullscreenIconTemplate: showFullscreenIconTemplate,
  hideFullscreenIconTemplate: hideFullscreenIconTemplate,
  zoomInIconTemplate: zoomInIconTemplate,
  zoomOutIconTemplate: zoomOutIconTemplate,
  closeIconTemplate: closeIconTemplate,
  spinnerContent: "Loading...",
};

const DefaultClasses = {
  caption:
    "text-white text-ellipsis overflow-hidden whitespace-nowrap mx-[10px] text-center",
  captionWrapper:
    "fixed left-0 bottom-0 w-full h-[50px] flex justify-center items-center",
  closeBtn:
    "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  fullscreenBtn:
    "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  gallery:
    "invisible fixed left-0 top-0 w-full h-full z-[1100] pointer-events-none opacity-0 bg-[#000000e6] transition-all duration-[400ms] motion-reduce:transition-none",
  galleryContent:
    "fixed top-[50px] left-[50px] w-[calc(100%-100px)] h-[calc(100%-100px)]",
  galleryCounter:
    "flex justify-center items-center px-[10px] mb-0 h-full text-[#b3b3b3]",
  img: "absolute left-0 top-0 w-full max-h-full h-auto cursor-pointer pointer-events-auto",
  imgWrapper:
    "absolute top-0 left-0 w-full h-full opacity-0 transform scale-[0.25] transition-all duration-[400ms] ease-out pointer-events-none motion-reduce:transition-none motion-reduce:transform-none",
  leftTools: "float-left h-full",
  loader:
    "fixed left-0 top-0 z-[2] w-full h-full text-neutral-50 opacity-1 flex justify-center items-center pointer-events-none transition-opacity duration-[1000ms] motion-reduce:transition-none",
  nextBtn:
    "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  nextBtnWrapper:
    "fixed right-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
  prevBtn:
    "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  prevBtnWrapper:
    "fixed left-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
  rightTools: "float-right",
  spinner:
    "inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]",
  spinnerContent:
    "!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]",
  toolbar:
    "absolute top-0 left-0 w-full h-[50px] z-20 transition-opacity duration-[400ms] motion-reduce:transition-none",
  vertical: "h-full max-h-full w-auto",
  zoomBtn:
    "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
};

const DefaultClassesType = {
  caption: "string",
  captionWrapper: "string",
  closeBtn: "string",
  fullscreenBtn: "string",
  gallery: "string",
  galleryContent: "string",
  galleryCounter: "string",
  img: "string",
  imgWrapper: "string",
  leftTools: "string",
  loader: "string",
  nextBtn: "string",
  nextBtnWrapper: "string",
  prevBtn: "string",
  prevBtnWrapper: "string",
  rightTools: "string",
  spinner: "string",
  spinnerContent: "string",
  toolbar: "string",
  vertical: "string",
  zoomBtn: "string",
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Lightbox {
  constructor(element, options = {}, classes) {
    this._element = element;
    this._options = options;
    this._classes = this._getClasses(classes);
    this._getContainer();

    this._id = `lightbox-${Math.random().toString(36).substr(2, 9)}`;
    this._activeImg = 0;
    this._images = [];
    this._zoom = 1;
    this._gallery = null;
    this._galleryToolbar = null;
    this._galleryContent = null;
    this._loader = null;
    this._imgCounter = null;
    this._animating = false;
    this._fullscreen = false;
    this._zoomBtn = null;
    this._fullscreenBtn = null;
    this._toolsToggleTimer = 0;
    this._mousedown = false;
    this._mousedownPositionX = 0;
    this._mousedownPositionY = 0;
    this._originalPositionX = 0;
    this._originalPositionY = 0;
    this._positionX = 0;
    this._positionY = 0;
    this._zoomTimer = 0;
    this._tapCounter = 0;
    this._tapTime = 0;
    this._rightArrow = null;
    this._leftArrowWrapper = null;
    this._rightArrowWrapper = null;
    this._initiated = false;
    this._multitouch = false;
    this._touchZoomPosition = [];

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      this.init();
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  get activeImg() {
    return this._activeImg;
  }

  get currentImg() {
    return SelectorEngine.findOne(
      `[${ATTR_STATE_ACTIVE}]`,
      this._galleryContent
    );
  }

  get options() {
    const config = {
      ...DEFAULT_OPTIONS,
      ...Manipulator.getDataAttributes(this._element),
      ...this._options,
    };

    typeCheckConfig(NAME, config, OPTIONS_TYPE);

    return config;
  }

  // Public
  init() {
    if (this._initiated) {
      return;
    }

    this._appendTemplate();
    this._initiated = true;
  }

  open(target = 0) {
    this._getImages();
    this._setActiveImg(target);
    this._sortImages();
    this._triggerEvents("open", "opened");

    this._loadImages().then((images) => {
      this._resizeImages(images);
      this._toggleTemplate();
      this._addEvents();
      this._focusFullscreenBtn();
    });
  }

  close() {
    this.reset();
    this._removeEvents();
    this._toggleTemplate();
    this._triggerEvents("close", "closed");
  }

  slide(target = "right") {
    if (this._animating === true || this._images.length <= 1) return;
    this._triggerEvents("slide", "slided");

    this._beforeSlideEvents();
    if (target === "right") this._slideHorizontally(target);
    if (target === "left") this._slideHorizontally(target);
    if (target === "first") this._slideToTarget(target);
    if (target === "last") this._slideToTarget(target);
    this._afterSlideEvents();
  }

  zoomIn() {
    if (this._zoom >= 3) return;
    this._triggerEvents("zoomIn", "zoomedIn");
    this._zoom += parseFloat(this.options.zoomLevel);
    Manipulator.style(this.currentImg.parentNode, {
      transform: `scale(${this._zoom})`,
    });

    this._updateZoomBtn();
  }

  zoomOut() {
    if (this._zoom <= 1) return;
    this._triggerEvents("zoomOut", "zoomedOut");
    this._zoom -= parseFloat(this.options.zoomLevel);
    Manipulator.style(this.currentImg.parentNode, {
      transform: `scale(${this._zoom})`,
    });

    this._updateZoomBtn();
    this._updateImgPosition();
  }

  toggleFullscreen() {
    if (this._fullscreen === false) {
      this._fullscreenBtn.setAttribute(ATTR_STATE_ACTIVE, "");
      this._fullscreenBtn.innerHTML = this.options.hideFullscreenIconTemplate;
      if (this._gallery.requestFullscreen) {
        this._gallery.requestFullscreen();
      }

      this._fullscreen = true;
    } else {
      this._fullscreenBtn.removeAttribute(ATTR_STATE_ACTIVE);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      this._fullscreen = false;
    }
  }

  reset() {
    this._restoreDefaultFullscreen();
    this._restoreDefaultPosition();
    this._restoreDefaultZoom();
    clearTimeout(this._toolsToggleTimer);
    clearTimeout(this._doubleTapTimer);
  }

  dispose() {
    EventHandler.off(
      document,
      EVENT_CLICK_DATA_API,
      SELECTOR_ATTR_TOGGLE,
      this.toggle
    );
    if (this._galleryContent) this._removeEvents();
    if (this._gallery) this._gallery.remove();

    Data.removeData(this._element, DATA_KEY);
    this._element = null;
  }

  // Private
  _getClasses(classes) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _getImages() {
    const allImages = SelectorEngine.find("img", this._element);
    const lightboxImages = allImages.filter(
      (image) => !image.hasAttribute(ATTR_LIGHTBOX_DISABLED)
    );
    this._images = lightboxImages;
  }

  _getContainer() {
    this._container = SelectorEngine.findOne(this.options.container);
  }

  _setActiveImg(target) {
    this._activeImg =
      typeof target === "number" ? target : this._images.indexOf(target.target);
  }

  _appendTemplate() {
    this._gallery = element("div");
    Manipulator.addClass(this._gallery, `${this._classes.gallery}`);
    this._element.dataset.id = this._id;
    this._gallery.id = this._id;

    this._appendLoader();
    this._appendToolbar();
    this._appendContent();
    this._appendArrows();
    this._appendCaption();
    this._container.append(this._gallery);
  }

  _appendToolbar() {
    this._galleryToolbar = element("div");
    this._imgCounter = element("p");
    this._fullscreenBtn = element("button");
    this._zoomBtn = element("button");
    const closeBtn = element("button");
    const leftTools = element("div");
    const rightTools = element("div");

    Manipulator.addClass(this._galleryToolbar, `${this._classes.toolbar}`);
    Manipulator.addClass(this._imgCounter, `${this._classes.galleryCounter}`);
    Manipulator.addClass(this._fullscreenBtn, `${this._classes.fullscreenBtn}`);
    Manipulator.addClass(this._zoomBtn, `${this._classes.zoomInBtn}`);
    Manipulator.addClass(this._zoomBtn, this._classes.zoomBtn);
    Manipulator.addClass(leftTools, `${this._classes.leftTools}`);
    Manipulator.addClass(rightTools, `${this._classes.rightTools}`);
    Manipulator.addClass(closeBtn, `${this._classes.closeBtn}`);

    this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate;
    closeBtn.innerHTML = this.options.closeIconTemplate;
    this._zoomBtn.innerHTML = this.options.zoomInIconTemplate;
    this._fullscreenBtn.setAttribute("aria-label", "Toggle fullscreen");
    this._zoomBtn.setAttribute("aria-label", "Zoom in");
    closeBtn.setAttribute("aria-label", "Close");

    EventHandler.on(this._fullscreenBtn, EVENT_CLICK_DATA_API, () =>
      this.toggleFullscreen()
    );
    EventHandler.on(this._zoomBtn, EVENT_CLICK_DATA_API, () =>
      this._toggleZoom()
    );
    EventHandler.on(closeBtn, EVENT_CLICK_DATA_API, () => this.close());

    leftTools.append(this._imgCounter);
    rightTools.append(this._fullscreenBtn);
    rightTools.append(this._zoomBtn);
    rightTools.append(closeBtn);

    this._galleryToolbar.append(leftTools);
    this._galleryToolbar.append(rightTools);
    this._gallery.append(this._galleryToolbar);
  }

  _appendContent() {
    this._galleryContent = element("div");
    Manipulator.addClass(
      this._galleryContent,
      `${this._classes.galleryContent}`
    );
    this._gallery.append(this._galleryContent);
  }

  _appendLoader() {
    this._loader = element("div");
    const spinner = element("div");
    const spinnerContent = element("span");

    Manipulator.addClass(this._loader, `${this._classes.loader}`);
    Manipulator.addClass(spinner, `${this._classes.spinner}`);
    Manipulator.addClass(spinnerContent, `${this._classes.spinnerContent}`);

    spinner.setAttribute("role", "status");
    spinnerContent.innerHTML = this.options.spinnerContent;

    spinner.append(spinnerContent);
    this._loader.append(spinner);
    this._gallery.append(this._loader);
  }

  _appendArrows() {
    this._leftArrowWrapper = element("div");
    Manipulator.addClass(
      this._leftArrowWrapper,
      `${this._classes.prevBtnWrapper}`
    );
    const leftArrow = element("button");
    leftArrow.setAttribute("aria-label", "Previous");
    Manipulator.addClass(leftArrow, `${this._classes.prevBtn}`);
    EventHandler.on(leftArrow, EVENT_CLICK_DATA_API, () => this.slide("left"));
    this._leftArrowWrapper.append(leftArrow);

    this._rightArrowWrapper = element("div");
    Manipulator.addClass(
      this._rightArrowWrapper,
      `${this._classes.nextBtnWrapper}`
    );
    this._rightArrow = element("button");
    this._rightArrow.setAttribute("aria-label", "Next");
    Manipulator.addClass(this._rightArrow, `${this._classes.nextBtn}`);
    EventHandler.on(this._rightArrow, EVENT_CLICK_DATA_API, () => this.slide());
    this._rightArrowWrapper.append(this._rightArrow);

    this._rightArrow.innerHTML = this.options.nextIconTemplate;
    leftArrow.innerHTML = this.options.prevIconTemplate;

    this._getImages();
    if (this._images.length <= 1) return;
    this._gallery.append(this._leftArrowWrapper);
    this._gallery.append(this._rightArrowWrapper);
  }

  _appendCaption() {
    const captionWrapper = element("div");
    const caption = element("p");

    caption.setAttribute(ATTR_LIGHTBOX_CAPTION, "");
    Manipulator.addClass(captionWrapper, `${this._classes.captionWrapper}`);
    Manipulator.addClass(caption, `${this._classes.caption}`);

    captionWrapper.append(caption);
    this._gallery.append(captionWrapper);
  }

  _sortImages() {
    for (let i = 0; i < this._activeImg; i++) {
      this._images.push(this._images.shift());
    }
  }

  async _loadImages() {
    const promiseArray = [];
    const imageArray = [];

    this._galleryContent.innerHTML = "";
    let positionLeft = 0;

    this._images.forEach((img, key) => {
      promiseArray.push(
        new Promise((resolve) => {
          const newImg = new Image();
          const newImgWrapper = element("div");
          Manipulator.addClass(newImgWrapper, `${this._classes.imgWrapper}`);
          Manipulator.addClass(newImg, `${this._classes.img}`);

          this._addImgStyles(newImg, newImgWrapper, positionLeft, key, img);

          newImgWrapper.append(newImg);
          this._galleryContent.append(newImgWrapper);

          newImg.onload = resolve;
          newImg.src = img.dataset.teImg || img.src;
          imageArray.push(newImg);

          positionLeft += 100;
        })
      );
    });

    await Promise.all(promiseArray);
    return imageArray;
  }

  _addImgStyles(newImg, newImgWrapper, positionLeft, key, img) {
    newImg.alt = img.alt;
    newImg.draggable = false;

    Manipulator.style(newImgWrapper, {
      position: "absolute",
      left: `${positionLeft}%`,
      top: 0,
    });
    if (img.dataset.teCaption || img.dataset.teCaption === "") {
      newImg.dataset.caption = img.dataset.teCaption;
    }

    if (positionLeft === 0) {
      if (img.width < img.height) {
        Manipulator.addClass(newImg, `${this._classes.vertical}`);
      }
      Manipulator.style(newImgWrapper, { opacity: 1 });
      newImg.setAttribute(ATTR_STATE_ACTIVE, "");
    } else {
      newImg.removeAttribute(ATTR_STATE_ACTIVE);
    }

    if (key === this._images.length - 1 && this._images.length > 1) {
      Manipulator.style(newImgWrapper, { left: "-100%" });
    }
  }

  _resizeImages(images) {
    images.forEach((img) => {
      this._calculateImgSize(img);
    });
  }

  _calculateImgSize(img) {
    if (img.width >= img.height) {
      img.style.width = "100%";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.top = `${(img.parentNode.offsetHeight - img.height) / 2}px`;
      img.style.left = 0;
    } else {
      img.style.height = "100%";
      img.style.maxHeight = "100%";
      img.style.width = "auto";
      img.style.left = `${(img.parentNode.offsetWidth - img.width) / 2}px`;
      img.style.top = 0;
    }

    if (img.width >= img.parentNode.offsetWidth) {
      img.style.width = `${img.parentNode.offsetWidth}px`;
      img.style.height = "auto";
      img.style.left = 0;
      img.style.top = `${(img.parentNode.offsetHeight - img.height) / 2}px`;
    }
    if (img.height >= img.parentNode.offsetHeight) {
      img.style.height = `${img.parentNode.offsetHeight}px`;
      img.style.width = "auto";
      img.style.top = 0;
      img.style.left = `${(img.parentNode.offsetWidth - img.width) / 2}px`;
    }

    this._positionX = parseFloat(img.style.left) || 0;
    this._positionY = parseFloat(img.style.top) || 0;
  }

  _onResize() {
    this._images = SelectorEngine.find("img", this._galleryContent);
    this._images.forEach((img) => {
      this._calculateImgSize(img);
    });
  }

  _onFullscreenChange() {
    const isFullscreenEnabled =
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement;
    if (isFullscreenEnabled === undefined) {
      this._fullscreen = false;
      this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate;
      this._fullscreenBtn.removeAttribute(ATTR_STATE_ACTIVE);
    }
  }

  _beforeSlideEvents() {
    this._animationStart();
    this._restoreDefaultZoom();
    this._restoreDefaultPosition();
    this._resetDoubleTap();
  }

  _slideHorizontally(direction) {
    this._images = SelectorEngine.find("img", this._galleryContent);
    this._images.forEach((img) => {
      let newPositionLeft;

      if (direction === "right") {
        newPositionLeft = parseInt(img.parentNode.style.left, 10) - 100;
        if (newPositionLeft < -100)
          newPositionLeft = (this._images.length - 2) * 100;
      } else {
        newPositionLeft = parseInt(img.parentNode.style.left, 10) + 100;
        if (newPositionLeft === (this._images.length - 1) * 100)
          newPositionLeft = -100;
      }

      this._slideImg(img, newPositionLeft);
    });

    this._updateActiveImg(direction);
  }

  _slideImg(img, position) {
    if (position === 0) {
      img.setAttribute(ATTR_STATE_ACTIVE, "");
      Manipulator.style(img.parentNode, { opacity: 1, transform: "scale(1)" });
    } else {
      img.removeAttribute(ATTR_STATE_ACTIVE);
      Manipulator.style(img.parentNode, {
        opacity: 0,
        transform: "scale(0.25)",
      });
    }
    img.parentNode.style.left = `${position}%`;
  }

  _slideToTarget(target) {
    if (target === "first" && this._activeImg === 0) return;
    if (target === "last" && this._activeImg === this._images.length - 1)
      return;

    this.reset();
    this._removeEvents();
    this._showLoader();

    this._getImages();
    this._activeImg = target === "first" ? 0 : this._images.length - 1;
    this._sortImages();

    Manipulator.style(this.currentImg.parentNode, {
      transform: "scale(0.25)",
      opacity: 0,
    });

    setTimeout(() => {
      this._loadImages().then((images) => {
        this._resizeImages(images);
        this._addEvents();
        this._updateCaption();
        this._hideLoader();
        setTimeout(() => {
          Manipulator.style(this.currentImg.parentNode, {
            transform: "scale(1)",
            opacity: 1,
          });
        }, 10);
      });
    }, 400);
  }

  _updateActiveImg(direction) {
    if (direction === "right") {
      if (this._activeImg === this._images.length - 1) {
        this._activeImg = 0;
      } else {
        this._activeImg++;
      }
    }

    if (direction === "left") {
      if (this._activeImg === 0) {
        this._activeImg = this._images.length - 1;
      } else {
        this._activeImg--;
      }
    }
  }

  _afterSlideEvents() {
    this._updateCounter();
    this._updateCaption();
  }

  _updateCounter() {
    if (this._images.length <= 1) return;
    setTimeout(() => {
      this._imgCounter.innerHTML = `${this._activeImg + 1} / ${
        this._images.length
      }`;
    }, 200);
  }

  _updateCaption() {
    setTimeout(() => {
      let caption = this.currentImg.alt;
      if (
        this.currentImg.dataset.caption ||
        this.currentImg.dataset.caption === ""
      ) {
        caption = this.currentImg.dataset.caption;
      }
      SelectorEngine.findOne(
        `[${ATTR_LIGHTBOX_CAPTION}]`,
        this._gallery
      ).innerHTML = caption;
    }, 200);
  }

  _toggleTemplate() {
    if (this._gallery.style.visibility === "visible") {
      Manipulator.style(this.currentImg.parentNode, {
        transform: "scale(0.25)",
      });

      setTimeout(() => {
        this._hideGallery();
        this._enableScroll();
        this._showLoader();
      }, 100);
    } else {
      this._showGallery();
      this._disableScroll();
      this._updateCounter();
      this._updateCaption();
      this._setToolsToggleTimout();
      this._hideLoader();
    }
  }

  _showLoader() {
    Manipulator.style(this._loader, { opacity: 1 });
  }

  _hideLoader() {
    Manipulator.style(this._loader, { opacity: 0 });
  }

  _hideGallery() {
    Manipulator.style(this._gallery, {
      opacity: 0,
      pointerEvents: "none",
      visibility: "hidden",
    });
  }

  _showGallery() {
    Manipulator.style(this._gallery, {
      opacity: 1,
      pointerEvents: "initial",
      visibility: "visible",
    });
    setTimeout(() => {
      Manipulator.style(this.currentImg.parentNode, { transform: "scale(1)" });
    }, 50);
  }

  _toggleZoom() {
    if (this._zoom !== 1) {
      this.zoomOut();
    } else {
      this.zoomIn();
    }
  }

  _updateZoomBtn() {
    if (this._zoom > 1) {
      this._zoomBtn.setAttribute(ATTR_STATE_ACTIVE, "");
      this._zoomBtn.setAttribute("aria-label", "Zoom out");
      this._zoomBtn.innerHTML = this.options.zoomOutIconTemplate;
    } else {
      this._zoomBtn.removeAttribute(ATTR_STATE_ACTIVE);
      this._zoomBtn.setAttribute("aria-label", "Zoom in");
      this._zoomBtn.innerHTML = this.options.zoomInIconTemplate;
    }
  }

  _updateImgPosition() {
    if (this._zoom === 1) {
      this._restoreDefaultPosition();
    }
  }

  _addEvents() {
    const images = SelectorEngine.find("img", this._galleryContent);

    this._onWindowTouchmove = this._onWindowTouchmove.bind(this);
    this._onWindowTouchstart = this._onWindowTouchstart.bind(this);
    this._onImgMousedown = this._onMousedown.bind(this);
    this._onImgMousemove = this._onMousemove.bind(this);
    this._onImgWheel = this._onZoom.bind(this);
    this._onImgMouseup = this._onMouseup.bind(this);
    this._onImgTouchend = this._onTouchend.bind(this);
    this._onImgDoubleClick = this._onDoubleClick.bind(this);
    this._onWindowResize = this._onResize.bind(this);
    this._onWindowFullscreenChange = this._onFullscreenChange.bind(this);
    this._onAnyImgAction = this._resetToolsToggler.bind(this);
    this._onGalleryClick = this._onBackdropClick.bind(this);
    this._onKeyupEvent = this._onKeyup.bind(this);
    this._onRightArrowKeydownEvent = this._onRightArrowKeydown.bind(this);
    this._onFullscreenBtnKeydownEvent = this._onFullscreenBtnKeydown.bind(this);

    images.forEach((img) => {
      EventHandler.on(img, "mousedown", this._onImgMousedown, {
        passive: true,
      });
      EventHandler.on(img, "touchstart", this._onImgMousedown, {
        passive: true,
      });
      EventHandler.on(img, "mousemove", this._onImgMousemove, {
        passive: true,
      });
      EventHandler.on(img, "touchmove", this._onImgMousemove, {
        passive: true,
      });
      EventHandler.on(img, "wheel", this._onImgWheel, { passive: true });
      EventHandler.on(img, "dblclick", this._onImgDoubleClick, {
        passive: true,
      });
    });

    document.addEventListener("touchmove", this._onWindowTouchmove, {
      passive: false,
    });
    EventHandler.on(window, "touchstart", this._onWindowTouchstart);
    EventHandler.on(window, "mouseup", this._onImgMouseup);
    EventHandler.on(window, "touchend", this._onImgTouchend);
    EventHandler.on(window, "resize", this._onWindowResize);
    EventHandler.on(window, "orientationchange", this._onWindowResize);
    EventHandler.on(window, "keyup", this._onKeyupEvent);
    EventHandler.on(window, "fullscreenchange", this._onWindowFullscreenChange);
    EventHandler.on(this._gallery, "mousemove", this._onAnyImgAction);
    EventHandler.on(this._gallery, "click", this._onGalleryClick);
    EventHandler.on(
      this._rightArrow,
      "keydown",
      this._onRightArrowKeydownEvent
    );
    EventHandler.on(
      this._fullscreenBtn,
      "keydown",
      this._onFullscreenBtnKeydownEvent
    );
  }

  _removeEvents() {
    const images = SelectorEngine.find("img", this._galleryContent);

    images.forEach((img) => {
      EventHandler.off(img, "mousedown", this._onImgMousedown);
      EventHandler.off(img, "touchstart", this._onImgMousedown);
      EventHandler.off(img, "mousemove", this._onImgMousemove);
      EventHandler.off(img, "touchmove", this._onImgMousemove);
      EventHandler.off(img, "wheel", this._onImgWheel);
      EventHandler.off(img, "dblclick", this._onImgDoubleClick);
    });

    document.removeEventListener("touchmove", this._onWindowTouchmove, {
      passive: false,
    });
    EventHandler.off(window, "touchstart", this._onWindowTouchstart);
    EventHandler.off(window, "mouseup", this._onImgMouseup);
    EventHandler.off(window, "touchend", this._onImgTouchend);
    EventHandler.off(window, "resize", this._onWindowResize);
    EventHandler.off(window, "orientationchange", this._onWindowResize);
    EventHandler.off(window, "keyup", this._onKeyupEvent);
    EventHandler.off(
      window,
      "fullscreenchange",
      this._onWindowFullscreenChange
    );
    EventHandler.off(this._gallery, "mousemove", this._onAnyImgAction);
    EventHandler.off(this._gallery, "click", this._onGalleryClick);
    EventHandler.off(
      this._rightArrow,
      "keydown",
      this._onRightArrowKeydownEvent
    );
    EventHandler.off(
      this._fullscreenBtn,
      "keydown",
      this._onFullscreenBtnKeydownEvent
    );
  }

  _onMousedown(e) {
    const touch = e.touches;
    const x = touch ? touch[0].clientX : e.clientX;
    const y = touch ? touch[0].clientY : e.clientY;

    this._originalPositionX = parseFloat(this.currentImg.style.left) || 0;
    this._originalPositionY = parseFloat(this.currentImg.style.top) || 0;
    this._positionX = this._originalPositionX;
    this._positionY = this._originalPositionY;
    this._mousedownPositionX = x * (1 / this._zoom) - this._positionX;
    this._mousedownPositionY = y * (1 / this._zoom) - this._positionY;
    this._mousedown = true;

    if (e.type === "touchstart") {
      if (e.touches.length > 1) {
        this._multitouch = true;
        this._touchZoomPosition = e.touches;
      }
    }
  }

  _onMousemove(e) {
    if (!this._mousedown) return;

    const touch = e.touches;
    const x = touch ? touch[0].clientX : e.clientX;
    const y = touch ? touch[0].clientY : e.clientY;

    if (touch) this._resetToolsToggler();

    if (!this._multitouch) {
      if (this._zoom !== 1) {
        this._positionX = x * (1 / this._zoom) - this._mousedownPositionX;
        this._positionY = y * (1 / this._zoom) - this._mousedownPositionY;
        Manipulator.style(this.currentImg, {
          left: `${this._positionX}px`,
          top: `${this._positionY}px`,
        });
      } else {
        if (this._images.length <= 1) return;
        this._positionX = x * (1 / this._zoom) - this._mousedownPositionX;
        Manipulator.style(this.currentImg, { left: `${this._positionX}px` });
      }
    }
  }

  _onMouseup(e) {
    this._mousedown = false;
    this._moveImg(e.target);
  }

  _onTouchend(e) {
    this._mousedown = false;

    if (this._multitouch) {
      if (e.targetTouches.length === 0) {
        this._multitouch = false;
        this._touchZoomPosition = [];
      }
    } else if (!this._multitouch) {
      this._checkDoubleTap(e);
      this._moveImg(e.target);
    }
  }

  _calculateTouchZoom(e) {
    const initialDistance = Math.hypot(
      this._touchZoomPosition[1].pageX - this._touchZoomPosition[0].pageX,
      this._touchZoomPosition[1].pageY - this._touchZoomPosition[0].pageY
    );
    const finalDistance = Math.hypot(
      e.touches[1].pageX - e.touches[0].pageX,
      e.touches[1].pageY - e.touches[0].pageY
    );
    const distanceChange = Math.abs(initialDistance - finalDistance);
    const screenWidth = e.view.screen.width;
    if (distanceChange > screenWidth * 0.03) {
      if (initialDistance <= finalDistance) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      this._touchZoomPosition = e.touches;
    }
  }

  _onWindowTouchstart(e) {
    if (e.touches.length > 1) {
      this._multitouch = true;
      this._touchZoomPosition = e.touches;
    }
  }

  _onWindowTouchmove(e) {
    e.preventDefault();
    if (e.type === "touchmove" && e.targetTouches.length > 1) {
      this._calculateTouchZoom(e);
    }
  }

  _onRightArrowKeydown(e) {
    switch (e.keyCode) {
      case 9:
        if (e.shiftKey) break;
        e.preventDefault();
        this._focusFullscreenBtn();
        break;
      default:
        break;
    }
  }

  _onFullscreenBtnKeydown(e) {
    switch (e.keyCode) {
      case 9:
        if (!e.shiftKey) break;
        e.preventDefault();
        this._focusRightArrow();
        break;
      default:
        break;
    }
  }

  _onKeyup(e) {
    this._resetToolsToggler();
    switch (e.keyCode) {
      case 39:
        this.slide();
        break;
      case 37:
        this.slide("left");
        break;
      case 27:
        this.close();
        break;
      case 36:
        this.slide("first");
        break;
      case 35:
        this.slide("last");
        break;
      case 38:
        this.zoomIn();
        break;
      case 40:
        this.zoomOut();
        break;
      default:
        break;
    }
  }

  _focusFullscreenBtn() {
    setTimeout(() => {
      this._fullscreenBtn.focus();
    }, 100);
  }

  _focusRightArrow() {
    this._rightArrow.focus();
  }

  _moveImg(target) {
    if (this._multitouch) return;
    if (
      this._zoom !== 1 ||
      target !== this.currentImg ||
      this._images.length <= 1
    )
      return;

    const movement = this._positionX - this._originalPositionX;
    if (movement > 0) {
      this.slide("left");
    } else if (movement < 0) {
      this.slide();
    }
  }

  _checkDoubleTap(e) {
    clearTimeout(this._doubleTapTimer);
    const currentTime = new Date().getTime();
    const tapLength = currentTime - this._tapTime;

    if (this._tapCounter > 0 && tapLength < 500) {
      this._onDoubleClick(e);
      this._doubleTapTimer = setTimeout(() => {
        this._tapTime = new Date().getTime();
        this._tapCounter = 0;
      }, 300);
    } else {
      this._tapCounter++;
      this._tapTime = new Date().getTime();
    }
  }

  _resetDoubleTap() {
    this._tapTime = 0;
    this._tapCounter = 0;
    clearTimeout(this._doubleTapTimer);
  }

  _onDoubleClick(e) {
    if (this._multitouch) return;

    if (!e.touches) this._setNewPositionOnZoomIn(e);
    if (this._zoom !== 1) {
      this._restoreDefaultZoom();
    } else {
      this.zoomIn();
    }
  }

  _onZoom(e) {
    if (e.deltaY > 0) {
      this.zoomOut();
    } else {
      if (this._zoom >= 3) return;
      this._setNewPositionOnZoomIn(e);
      this.zoomIn();
    }
  }

  _onBackdropClick(e) {
    this._resetToolsToggler();

    if (e.target.tagName !== "DIV") return;
    this.close();
  }

  _setNewPositionOnZoomIn(e) {
    clearTimeout(this._zoomTimer);
    this._positionX = window.innerWidth / 2 - e.offsetX - 50;
    this._positionY = window.innerHeight / 2 - e.offsetY - 50;
    this.currentImg.style.transition = "all 0.5s ease-out";
    this.currentImg.style.left = `${this._positionX}px`;
    this.currentImg.style.top = `${this._positionY}px`;

    this._zoomTimer = setTimeout(() => {
      this.currentImg.style.transition = "none";
    }, 500);
  }

  _resetToolsToggler() {
    this._showTools();
    clearTimeout(this._toolsToggleTimer);
    this._setToolsToggleTimout();
  }

  _setToolsToggleTimout() {
    this._toolsToggleTimer = setTimeout(() => {
      this._hideTools();
      clearTimeout(this._toolsToggleTimer);
    }, 4000);
  }

  _hideTools() {
    Manipulator.style(this._galleryToolbar, { opacity: 0 });
    Manipulator.style(this._leftArrowWrapper, { opacity: 0 });
    Manipulator.style(this._rightArrowWrapper, { opacity: 0 });
  }

  _showTools() {
    Manipulator.style(this._galleryToolbar, { opacity: 1 });
    Manipulator.style(this._leftArrowWrapper, { opacity: 1 });
    Manipulator.style(this._rightArrowWrapper, { opacity: 1 });
  }

  _disableScroll() {
    Manipulator.addClass(document.body, `overflow-y-hidden relative`);

    if (
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight
    ) {
      Manipulator.addClass(document.body, `md:pr-[17px]`);
    }
  }

  _enableScroll() {
    setTimeout(() => {
      Manipulator.removeClass(document.body, `overflow-y-hidden relative`);
      Manipulator.removeClass(document.body, `md:pr-[17px]`);
    }, 300);
  }

  _animationStart() {
    this._animating = true;
    setTimeout(() => {
      this._animating = false;
    }, 400);
  }

  _restoreDefaultZoom() {
    if (this._zoom !== 1) {
      this._zoom = 1;
      Manipulator.style(this.currentImg.parentNode, {
        transform: `scale(${this._zoom})`,
      });

      this._updateZoomBtn();
      this._updateImgPosition();
    }
  }

  _restoreDefaultFullscreen() {
    if (this._fullscreen) this.toggleFullscreen();
  }

  _restoreDefaultPosition() {
    clearTimeout(this._zoomTimer);
    const currentImg = this.currentImg;

    Manipulator.style(this.currentImg.parentNode, { left: 0, top: 0 });
    Manipulator.style(this.currentImg, {
      transition: "all 0.5s ease-out",
      left: 0,
      top: 0,
    });

    this._calculateImgSize(currentImg);

    setTimeout(() => {
      Manipulator.style(this.currentImg, { transition: "none" });
    }, 500);
  }

  async _triggerEvents(startEvent, completeEvent) {
    EventHandler.trigger(this._element, `${startEvent}.te.lightbox`);

    if (completeEvent) {
      await setTimeout(() => {
        EventHandler.trigger(this._element, `${completeEvent}.te.lightbox`);
      }, 505);
    }
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }

  static toggle() {
    return function (event) {
      const lightbox = SelectorEngine.closest(
        event.target,
        `${SELECTOR_ATTR_LIGHTBOX}`
      );
      const instance = Lightbox.getInstance(lightbox) || new Lightbox(lightbox);
      instance.open(event);
    };
  }

  static jQueryInterface(config, options) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;
      if (!data && /dispose/.test(config)) {
        return;
      }
      if (!data) {
        data = new Lightbox(this, _config);
      }
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](options);
      }
    });
  }
}

export default Lightbox;
