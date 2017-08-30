# `perfect-scrollbar`

Minimalistic but perfect custom scrollbar plugin

[![Travis CI](https://travis-ci.org/noraesae/perfect-scrollbar.svg?branch=master)](https://travis-ci.org/noraesae/perfect-scrollbar)

## Why perfect-scrollbar?

perfect-scrollbar is minimalistic but *perfect* (for me, and maybe for most
developers) scrollbar plugin working with jQuery or vanilla JavaScript as well.

* No implicit style change on original DOM elements
* No change on the original design layout
* Use plain `scrollTop` and `scrollLeft`
* Scrollbar style is (nearly) fully customizable
* Efficient update on container layout change

I hope you love it!

## [Demo](http://noraesae.github.com/perfect-scrollbar/)

[It's on the GitHub Pages](http://noraesae.github.com/perfect-scrollbar/).

## Table of Contents

* [Install](#install)
* [Before using perfect-scrollbar](#before-using-perfect-scrollbar)
* [How to use](#how-to-use)
* [jQuery](#jquery)
* [Optional parameters](#optional-parameters)
* [Events](#events)
* [Helpdesk](#helpdesk)
* [IE Support](#ie-support)
* [License](#license)

## Install

#### npm

The best way to install and use perfect-scrollbar is with npm.  It's registered
as [perfect-scrollbar](https://www.npmjs.com/package/perfect-scrollbar).

```
$ npm install perfect-scrollbar
```

#### Manually

You can manually download perfect-scrollbar
on [Releases](https://github.com/noraesae/perfect-scrollbar/releases).

#### From sources

If you want to use the development version of the plugin, use the source files
which are not minified. They're in the `src` directory.  The development version
may be unstable, but some known bugs may have been fixed.

```
$ git clone https://github.com/noraesae/perfect-scrollbar.git
$ cd perfect-scrollbar/src
$ npm install
$ gulp # will lint and build the source code.
```

#### JSFiddle

You can fork the following JSFiddles for testing and experimenting purposes:

* [Perfect Scrollbar](https://jsfiddle.net/DanielApt/xv0rrxv3/)
* [Perfect Scrollbar (jQuery)](https://jsfiddle.net/DanielApt/gbfLazpx/)

#### Unofficial sources

The followings are not maintained officially. If there are issues of the
following sources, please ask in each repository.

######  CDNs

* [cdnjs](http://www.cdnjs.com/libraries/jquery.perfect-scrollbar)
* [JSDelivr](https://www.jsdelivr.com/projects/perfect-scrollbar)

###### Other projects

* [perfect-scrollbar-rails gem](https://github.com/YourCursus/perfect-scrollbar-rails)

## Before using perfect-scrollbar

***Please beware handling scroll event is bad for performance. It should be
avoided when possible.***

The following requirements should meet.

* the container must have a 'position' css style.
* the container must be a normal container element.
  * PS may not work well in `body`, `textarea`, `iframe` or flexbox.

The following requirements are included in the basic CSS, but please keep in
mind when you'd like to change the CSS files.

* the container must have an 'overflow: hidden' css style.
* the scrollbar's position must be 'absolute'.
* the scrollbar-x must have a 'bottom' css style, and the scrollbar-y must have
  a 'right' css style.

Please keep in mind that perfect-scrollbar won't completely emulate native
scrolls. Scroll hooking is generally considered as bad practice, and
perfect-scrollbar should be used with care. Unless custom scroll is really
needed, please consider using native scrolls.

## How to use

First of all, please check if the container element meets the requirements.

```html
<link rel="stylesheet" href="dist/css/perfect-scrollbar.css" />
<style>
  #container {
    position: relative;
    height: 100%; /* Or whatever you want (e.g. 400px) */
  }
</style>
```

I would recommend using CJS or ES modules.

```js
const Ps = require('perfect-scrollbar');
import * as Ps from 'perfect-scrollbar';
```

Or you can just load the script file as usual.

```html
<script src="dist/js/perfect-scrollbar.js"></script>
```

To initialise the plugin, use `Ps.initialize`.

```js
const container = document.querySelector('#container');
Ps.initialize(container);
```

It can be initialised with optional parameters.

```js
Ps.initialize(container, {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
});
```

If the size of your container or content changes, call `update`.

```js
Ps.update(container);
```

If you want to destroy the scrollbar, use `destroy`.

```js
Ps.destroy(container);
```

If you want to scroll to somewhere, just update `scrollTop`.

```js
container.scrollTop = 0;
```

You can also get information about how to use the plugin from code in the
`examples` directory of the source tree.

## jQuery

As you may already know, perfect-scrollbar was a jQuery plugin. And it *is*
too. There's a jQuery adaptor and the plugin can be used in the same way it used
to work before.

I also recommend using CJS here, but it's not mandatory.

```js
require('perfect-scrollbar/jquery')($);
```

For sure, you can just include a built script.

```html
<script src="dist/js/perfect-scrollbar.jquery.js"></script>
```

After importing it, you can use the plugin in the usual way.

```js
$('#container').perfectScrollbar();          // Initialize
$('#container').perfectScrollbar({ ... });   // with options
$('#container').perfectScrollbar('update');  // Update
$('#container').perfectScrollbar('destroy'); // Destroy
```

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
If this option is true, swipe scrolling will be eased.  **Default**: `true`

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

### theme

A string. It's a class name added to the container element. The class name is
prepended with `ps-theme-`. So default theme class name is
`ps-theme-default`. In order to create custom themes with scss use
`ps-container($theme)` mixin, where `$theme` is a scss map.

**Default**: `'default'`

**Example 1:**

Add `theme` parameter:

```js
Ps.initialize(container, {
  theme: 'my-theme-name'
});
```

Create a class name prefixed with `.ps-theme-`. Include `ps-container()`
mixin. It's recommended to use `map-merge()` to extend `$ps-theme-default` map
with your custom styles.

```scss
.ps-theme-my-theme-name {
  @include ps-container(map-merge($ps-theme-default, (
    border-radius: 0,
    scrollbar-x-rail-height: 20px,
    scrollbar-x-height: 20px,
    scrollbar-y-rail-width: 20px,
    scrollbar-y-width: 20px
  )));
}
```

**Example 2:**

Alternatively, if you don't want to create your own themes, but only modify the
default one, you could simply overwrite `$ps-*` variables with your own
values. In this case `theme` parameter is not required when calling
`.initialize()` method. Remember do define your own variables before the
`theme.scss` file is imported.


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

You can listen to these events either with vanilla JavaScript or jQuery.

```js
container.addEventListener('ps-scroll-x', () => ...);
$(container).on('ps-scroll-x', () => ...);
```

## Helpdesk

If you have any idea to improve this project or any problem using this, please
feel free to upload an [issue](https://github.com/noraesae/perfect-scrollbar/issues).

For common problems, there is a [FAQ](https://github.com/noraesae/perfect-scrollbar/wiki/FAQ) wiki
page. Please check the page before uploading an issue.

Also, the project is not actively maintained. No maintainer is paid, and most of
us are busy on our professional or personal works. Please understand that it may
take a while for an issue to be resolved. Uploading a PR would be the fastest
way to fix an issue.

## IE Support

The plugin is developed to work in modern MS browsers, specifically IE
11 and Edge. When there is any issue, please [file it](https://github.com/noraesae/perfect-scrollbar/issues).

**The patches to fix problems in IE<=10 won't be accepted.**

When old IEs should be supported, please fork the project and make patches
personally.

## License

The MIT License (MIT) Copyright (c) 2012-2017 Hyunje Jun and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
