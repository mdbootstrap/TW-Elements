<p align="center">
  <a href="https://mdbootstrap.com/docs/jquery/getting-started/download/?utm_source=GitHub&utm_medium=PerfectScrollbar">
    <img src="https://mdbootstrap.com/img/Marketing/general/logo/medium/mdb-r.png">
  </a>
</p>

<h1 align="center">perfect-scrollbar</h1>

<p align="center">Minimalistic but perfect custom scrollbar plugin<p>


<p align="center">	
  <a href="https://npmcharts.com/compare/perfect-scrollbar?minimal=true"><img src="https://img.shields.io/npm/dm/perfect-scrollbar.svg" alt="Downloads"></a>
  <a href="https://github.com/mdbootstrap/bootstrap-material-design/blob/master/License.pdf"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>	
  <a href="https://badge.fury.io/js/perfect-scrollbar"><img src="https://badge.fury.io/js/perfect-scrollbar.svg" alt="npm"></a>	
  <a href="https://twitter.com/intent/tweet/?text=Thanks+@mdbootstrap+for+maintaining+amazing+and+free+Perfect+Scrollbar+Plugin%20https://mdbootstrap.com/freebies/perfect-scrollbar/&hashtags=javascript,code,webdesign,github"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>	
</p>

## [Official documentation](https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar)
***The official documentation can be found [here](https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar).***
***To read documentation for versions < 1.0, please visit [`v0.8.1`](https://github.com/mdbootstrap/perfect-scrollbar/tree/0.8.1).***

________

## Why perfect-scrollbar?

perfect-scrollbar is minimalistic but *perfect* (for us, and maybe for most
developers) scrollbar plugin.

* No change on design layout
* No manipulation on DOM tree
* Use plain `scrollTop` and `scrollLeft`
* Scrollbar style is fully customizable
* Efficient update on layout change

We hope you will love it!

## Live preview

Check out the [Live Preview](https://mdbootstrap.com/snippets/jquery/filipkapusta/765760/?utm_source=GitHub&utm_medium=PerfectScrollbar) snippet. You can fork it right away for testing and experimenting purposes.

## More useful plugins

***You'll find some example plugins below, you can explore all of them [here](https://mdbootstrap.com/plugins/jquery/?utm_source=GitHub&utm_medium=PerfectScrollbar)***

[Datatable Plugin](https://mdbootstrap.com/docs/jquery/tables/datatables/?utm_source=GitHub&utm_medium=PerfectScrollbar)| [Treeview Plugin](https://mdbootstrap.com/plugins/jquery/treeview/?utm_source=GitHub&utm_medium=PerfectScrollbar)| [Filter Plugin](https://mdbootstrap.com/plugins/jquery/filter/?utm_source=GitHub&utm_medium=PerfectScrollbar)
------------ | ------------- | -------------
<a href="https://mdbootstrap.com/docs/jquery/tables/datatables/?utm_source=GitHub&utm_medium=PerfectScrollbar"><img  src="https://mdbootstrap.com/img/Marketing/products/jquery/plugins/datatable.jpg" alt="Filter Plugin"></a> | <a href="https://mdbootstrap.com/plugins/jquery/treeview/?utm_source=GitHub&utm_medium=PerfectScrollbar"><img   src="https://mdbootstrap.com/img/Marketing/products/jquery/plugins/treeview.jpg" alt="Filter Plugin"></a> | <a href="https://mdbootstrap.com/plugins/jquery/filter/?utm_source=GitHub&utm_medium=PerfectScrollbar"><img  src="https://mdbootstrap.com/img/Marketing/products/jquery/plugins/filter.jpg" alt="Filter Plugin"></a>
_________

## Table of Contents

* [Install](#install)
* [Before using perfect-scrollbar](#before-using-perfect-scrollbar)
* [Caveats](#caveats)
* [How to use](#how-to-use)
* [Options](#options)
* [Events](#events)
* [Helpdesk](#helpdesk)
* [IE Support](#ie-support)
* [License](#license)
* [Related resources](#related-resources)
* [Social media](#social-media)

## Install

#### Download now

You can manually download perfect-scrollbar [here](https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar).

#### npm

You can install and use perfect-scrollbar with npm. It's registered
as [perfect-scrollbar](https://www.npmjs.com/package/perfect-scrollbar).

```
$ npm install perfect-scrollbar
```
#### From sources

If you want to use the development version of the plugin, build from source
manually. The development version may be unstable.

```
$ git clone https://github.com/mdbootstrap/perfect-scrollbar.git
$ cd perfect-scrollbar
$ npm install
$ npm run build
```

#### Unofficial sources

Sources not mentioned above are not maintained officially. If there are issues
of the following sources, please ask and resolve in each repository.

## Before using perfect-scrollbar

The following requirements should meet.

* the container must have a `position` style.
* the container must be a normal container element.

The following requirements are included in the basic CSS, but please keep in
mind when you'd like to change the CSS files.

* the container must have an `overflow: hidden` css style.
* the scrollbar's position must be `absolute`.
* the scrollbar-x must have `bottom` or `top`, and the scrollbar-y must have
  `right` or `left`.

Finally, scroll hooking is generally considered as a bad practice, and
perfect-scrollbar should be used carefully. Unless custom scroll is really
needed, using browser-native scroll is always recommended.

## Caveats

perfect-scrollbar emulates some scrolls, but not all of the kinds. It also *does not* work
in some situations. You can find these cases in [Caveats](https://github.com/mdbootstrap/perfect-scrollbar/wiki/Caveats).
Basically, items listed in the caveats are hacky to implement and may not be
implemented in the future. If the features are really needed, please consider
using browser-native scroll.

## How to use

First of all, please check if the container element meets the requirements and
the main CSS is imported.

```html
<style>
  #container {
    position: relative;
    width: 600px;
    height: 400px;
  }
</style>
<link rel="stylesheet" href="css/perfect-scrollbar.css">
```


Import via ES modules:

```js
import PerfectScrollbar from 'perfect-scrollbar';
```

Or in browser:

```html
<script src="dist/perfect-scrollbar.js"></script>
```

To initialise:

```js
const container = document.querySelector('#container');
const ps = new PerfectScrollbar(container);

// or just with selector string
const ps = new PerfectScrollbar('#container');
```

It can be initialised with [options](#options).

```js
const ps = new PerfectScrollbar('#container', {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
});
```

If the size of your container or content changes, call `update`.

```js
ps.update();
```

If you want to destroy the scrollbar, use `destroy`.

```js
ps.destroy();
ps = null; // to make sure garbages are collected
```

If you want to scroll to somewhere, just update `scrollTop`.

```js
const container = document.querySelector('#container');
container.scrollTop = 0;
```

You can also get information about how to use the plugin from code in [`examples/`](examples).

## Options

### `handlers {String[]}`

It is a list of handlers to scroll the element.

**Default**: `['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch']`

### `wheelSpeed {Number}`

The scroll speed applied to mousewheel event.

**Default**: `1`

### `wheelPropagation {Boolean}`

If this option is true, when the scroll reaches the end of the side, mousewheel
event will be propagated to parent element.

**Default**: `true`

### `swipeEasing {Boolean}`

If this option is true, swipe scrolling will be eased.

**Default**: `true`

### `minScrollbarLength {Number?}`

When set to an integer value, the thumb part of the scrollbar will not shrink
below that number of pixels.

**Default**: `null`

### `maxScrollbarLength {Number?}`

When set to an integer value, the thumb part of the scrollbar will not expand
over that number of pixels.

**Default**: `null`

### `scrollingThreshold {Number}`

This sets threshold for `ps--scrolling-x` and `ps--scrolling-y` classes to
remain. In the default CSS, they make scrollbars shown regardless of hover
state. The unit is millisecond.

**Default**: `1000`

### `useBothWheelAxes {Boolean}`

When set to true, and only one (vertical or horizontal) scrollbar is visible
then both vertical and horizontal scrolling will affect the scrollbar.

**Default**: `false`

### `suppressScrollX {Boolean}`

When set to true, the scrollbar in X-axis will not be available, regardless of
the content width.

**Default**: `false`

### `suppressScrollY {Boolean}`

When set to true, the scroll bar in Y-axis will not be available, regardless of
the content height.

**Default**: `false`

### `scrollXMarginOffset {Number}`

The number of pixels the content width can surpass the container width without
enabling the X-axis scroll bar. Allows some "wiggle room" or "offset break", so
that X-axis scroll bar is not enabled just because of a few pixels.

**Default**: `0`

### `scrollYMarginOffset {Number}`

The number of pixels the content height can surpass the container height without
enabling the Y-axis scroll bar. Allows some "wiggle room" or "offset break", so
that Y-axis scroll bar is not enabled just because of a few pixels.

**Default**: `0`

## Events

perfect-scrollbar dispatches custom events.

```js
container.addEventListener('ps-scroll-x', () => ...);
```

### `ps-scroll-y`

This event fires when the y-axis is scrolled in either direction.

### `ps-scroll-x`

This event fires when the x-axis is scrolled in either direction.

### `ps-scroll-up`

This event fires when scrolling upwards.

### `ps-scroll-down`

This event fires when scrolling downwards.

### `ps-scroll-left`

This event fires when scrolling to the left.

### `ps-scroll-right`

This event fires when scrolling to the right.

### `ps-y-reach-start`

This event fires when scrolling reaches the start of the y-axis.

### `ps-y-reach-end`

This event fires when scrolling reaches the end of the y-axis (useful for
infinite scroll).

### `ps-x-reach-start`

This event fires when scrolling reaches the start of the x-axis.

### `ps-x-reach-end`

This event fires when scrolling reaches the end of the x-axis.

You can also watch the reach state via the `reach` property.

```js
const ps = new PerfectScrollbar(...);

console.log(ps.reach.x); // => 'start' or 'end' or null
console.log(ps.reach.y); // => 'start' or 'end' or null
```

## Helpdesk

If you have any idea to improve this project or any problem using this, please
feel free to upload an [issue](https://github.com/mdbootstrap/perfect-scrollbar/issues).

For common problems, there is a [FAQ](https://github.com/mdbootstrap/perfect-scrollbar/wiki/FAQ) wiki
page. Please check the page before uploading an issue.

Also, the project is not actively maintained. No maintainer is paid, and most of
us are busy on our professional or personal works. Please understand that it may
take a while for an issue to be resolved. Uploading a PR would be the fastest
way to fix an issue.

## IE Support

The plugin is developed to work in modern MS browsers including Edge and IE11,
but may have some issues in IE11 mainly because of IE rendering bug concerning
sync update on scroll properties. The problem is mentioned in
[Caveats](https://github.com/mdbootstrap/perfect-scrollbar/wiki/Caveats) too.

IE<11 is not supported, and patches to fix problems in IE<=10 will not be
accepted. When old IEs should be supported, please fork the project and make
modification locally.

## License

[MIT](LICENSE)

## Related resources

- [Material Scrollbar](https://mdbootstrap.com/docs/jquery/javascript/scroll/?utm_source=GitHub&utm_medium=PerfectScrollbar)

- [Table scroll](https://mdbootstrap.com/docs/jquery/tables/scroll/?utm_source=GitHub&utm_medium=PerfectScrollbar)

- [Full screen scroller](https://mdbootstrap.com/plugins/jquery/screen-scroller/?utm_source=GitHub&utm_medium=PerfectScrollbar)

- [Scrollspy](https://mdbootstrap.com/docs/jquery/navigation/scrollspy/?utm_source=GitHub&utm_medium=PerfectScrollbar)

## Social Media

 - [Twitter](https://twitter.com/MDBootstrap)

 - [Facebook](https://www.facebook.com/mdbootstrap) 

 - [Pinterest](https://pl.pinterest.com/mdbootstrap)

 - [Dribbble](https://dribbble.com/mdbootstrap)

 - [LinkedIn](https://www.linkedin.com/company/material-design-for-bootstrap)
 
 - [YouTube](https://www.youtube.com/channel/UC5CF7mLQZhvx8O5GODZAhdA)

## MDB PRO

 - [Material Design for Bootstrap PRO](https://mdbootstrap.com/products/jquery-ui-kit/?utm_source=GitHub&utm_medium=PerfectScrollbar)
