# perfect-scrollbar

Minimalistic but perfect custom scrollbar plugin

[![Travis CI](https://travis-ci.org/utatti/perfect-scrollbar.svg?branch=master)](https://travis-ci.org/utatti/perfect-scrollbar)

## Why perfect-scrollbar?

perfect-scrollbar is minimalistic but *perfect* (for me, and maybe for most
developers) scrollbar plugin.

* No implicit style change on original DOM elements
* No change on the original design layout
* Use plain `scrollTop` and `scrollLeft`
* Scrollbar style is (nearly) fully customizable
* Efficient update on container layout change

I hope you love it!

## Demo

It's on the [GitHub Pages](http://utatti.github.com/perfect-scrollbar/).

## Table of Contents

* [Install](#install)
* [Before using perfect-scrollbar](#before-using-perfect-scrollbar)
* [How to use](#how-to-use)
* [Optional parameters](#optional-parameters)
* [Events](#events)
* [Helpdesk](#helpdesk)
* [IE Support](#ie-support)
* [License](#license)

## Install

#### npm

The best way to install and use perfect-scrollbar is with npm. It's registered
as [perfect-scrollbar](https://www.npmjs.com/package/perfect-scrollbar).

```
$ npm install perfect-scrollbar
```

#### Manual download

You can manually download perfect-scrollbar
from [Releases](https://github.com/utatti/perfect-scrollbar/releases).

#### From sources

If you want to use the development version of the plugin, build from source
manually. The development version may be unstable.

```
$ git clone https://github.com/utatti/perfect-scrollbar.git
$ cd perfect-scrollbar
$ npm install
$ npm run build
```

#### JSFiddle

You can fork the following JSFiddles for testing and experimenting purposes:

* [Perfect Scrollbar](https://jsfiddle.net/DanielApt/xv0rrxv3/) (FIXME: it's old)

#### Unofficial sources

The followings are not maintained officially. If there are issues of the
following sources, please ask and resolve in each repository.

###### CDNs

* [cdnjs](http://www.cdnjs.com/libraries/jquery.perfect-scrollbar)
* [JSDelivr](https://www.jsdelivr.com/projects/perfect-scrollbar)

###### Other projects

* [perfect-scrollbar-rails gem](https://github.com/YourCursus/perfect-scrollbar-rails)

## Before using perfect-scrollbar

***Please beware that it is a bad practice to handle scroll events via JS. It
should be avoided when possible.***

The following requirements should meet.

* the container must have a `position` style.
* the container must be a normal container element.
  * **PS may not work well in `body`, `textarea`, `iframe` or flexbox**.

The following requirements are included in the basic CSS, but please keep in
mind when you'd like to change the CSS files.

* the container must have an `overflow: hidden` css style.
* the scrollbar's position must be `absolute`.
* the scrollbar-x must have `bottom` or `top`, and the scrollbar-y must have
  `right` or `left`.

Please keep in mind that perfect-scrollbar won't completely emulate native
scrolls. Scroll hooking is generally considered as a bad practice, and
perfect-scrollbar should be used carefully. Unless custom scroll is really
needed, using native scroll is recommended.

## How to use

First of all, please check if the container element meets the requirements and
the main CSS is imported.

```html
<style>
  #container {
    position: relative;
    height: 100%; /* Or whatever you want (e.g. 400px) */
  }
</style>
<link rel="stylesheet" href="css/perfect-scrollbar.css">
```

Using CJS or ES modules:

```js
const ps = require('perfect-scrollbar');
import ps from 'perfect-scrollbar';
```

Or in browser:

```html
<script src="dist/perfect-scrollbar.js"></script>
```

To initialise the plugin, use `ps.initialize`.

```js
const container = document.querySelector('#container');
ps.initialize(container);
```

It can be initialised with optional parameters.

```js
ps.initialize(container, {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
});
```

If the size of your container or content changes, call `update`.

```js
ps.update(container);
```

If you want to destroy the scrollbar, use `destroy`.

```js
ps.destroy(container);
```

If you want to scroll to somewhere, just update `scrollTop`.

```js
container.scrollTop = 0;
```

You can also get information about how to use the plugin from code in the
`examples` directory of the source tree.

## Optional parameters

perfect-scrollbar supports optional parameters.

### handlers

It is a list of handlers to use to scroll the element.

**Default**: `['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch']`

**Disabled by default**: `'selection'`

### wheelSpeed

The scroll speed applied to mousewheel event.

**Default**: `1`

### wheelPropagation

If this option is true, when the scroll reaches the end of the side, mousewheel
event will be propagated to parent element.

**Default**: `false`

### swipePropagation

If this option is true, when the scroll reaches the end of the side, touch
scrolling will be propagated to parent element.

**Default**: `true`

### swipeEasing

If this option is true, swipe scrolling will be eased.

**Default**: `true`

### minScrollbarLength

When set to an integer value, the thumb part of the scrollbar will not shrink
below that number of pixels.

**Default**: `null`

### maxScrollbarLength

When set to an integer value, the thumb part of the scrollbar will not expand
over that number of pixels.

**Default**: `null`

### useBothWheelAxes

When set to true, and only one (vertical or horizontal) scrollbar is visible
then both vertical and horizontal scrolling will affect the scrollbar.

**Default**: `false`

### suppressScrollX

When set to true, the scroll bar in X axis will not be available, regardless of
the content width.

**Default**: `false`

### suppressScrollY

When set to true, the scroll bar in Y axis will not be available, regardless of
the content height.

**Default**: `false`

### scrollXMarginOffset

The number of pixels the content width can surpass the container width without
enabling the X axis scroll bar. Allows some "wiggle room" or "offset break", so
that X axis scroll bar is not enabled just because of a few pixels.

**Default**: `0`

### scrollYMarginOffset

The number of pixels the content height can surpass the container height without
enabling the Y axis scroll bar. Allows some "wiggle room" or "offset break", so
that Y axis scroll bar is not enabled just because of a few pixels.

**Default**: `0`

## Events

perfect-scrollbar dispatches custom events.

### ps-scroll-y

This event fires when the y-axis is scrolled in either direction.

### ps-scroll-x

This event fires when the x-axis is scrolled in either direction.

### ps-scroll-up

This event fires when scrolling upwards.

### ps-scroll-down

This event fires when scrolling downwards.

### ps-scroll-left

This event fires when scrolling to the left.

### ps-scroll-right

This event fires when scrolling to the right.

### ps-y-reach-start

This event fires when scrolling reaches the start of the y-axis.

### ps-y-reach-end

This event fires when scrolling reaches the end of the y-axis (useful for
infinite scroll).

### ps-x-reach-start

This event fires when scrolling reaches the start of the x-axis.

### ps-x-reach-end

This event fires when scrolling reaches the end of the x-axis.

```js
container.addEventListener('ps-scroll-x', () => ...);
```

## Helpdesk

If you have any idea to improve this project or any problem using this, please
feel free to upload an [issue](https://github.com/utatti/perfect-scrollbar/issues).

For common problems, there is a [FAQ](https://github.com/utatti/perfect-scrollbar/wiki/FAQ) wiki
page. Please check the page before uploading an issue.

Also, the project is not actively maintained. No maintainer is paid, and most of
us are busy on our professional or personal works. Please understand that it may
take a while for an issue to be resolved. Uploading a PR would be the fastest
way to fix an issue.

## IE Support

The plugin is developed to work in modern MS browsers, specifically IE
11 and Edge. When there is any issue, please [file it](https://github.com/utatti/perfect-scrollbar/issues).

**The patches to fix problems in IE<=10 won't be accepted.**

When old IEs should be supported, please fork the project and make patches
personally.

## License

[MIT](LICENSE)
