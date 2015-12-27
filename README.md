# `perfect-scrollbar`

Minimalistic but perfect custom scrollbar plugin

[![Travis CI](https://travis-ci.org/noraesae/perfect-scrollbar.svg?branch=master)](https://travis-ci.org/noraesae/perfect-scrollbar)

If you want information of old versions&lt;0.6.0, please refer to
[an old documentation](https://github.com/noraesae/perfect-scrollbar/tree/0.5.9).

## Why perfect-scrollbar?

I was once working on a personal project, and trying to find the jQuery
scrollbar plugin that's *perfect*. But there was no *perfect* one.
That's why I decided to make one.

perfect-scrollbar is minimalistic but *perfect* (for me, and maybe for most developers)
scrollbar plugin working with jQuery or vanilla JavaScript as well.

I hope you love it!

## [Demo](http://noraesae.github.com/perfect-scrollbar/)

[It's on the GitHub Pages](http://noraesae.github.com/perfect-scrollbar/).

## What does *perfect* mean?

*perfect* means...

* There should be no css change on any original element.
* The scrollbar should not affect the original design layout.
* The design of the scrollbar should be (nearly) fully customizable.
* If the size of the container or the content changes, the scrollbar
  size and position should be able to change.
* *New!* It should work with vanilla JavaScript and major tools like
  NPM or Browserify.

## Then perfect-scrollbar is really *perfect*?

* perfect-scrollbar has some requirements, but doesn't change or add
  any style on original elements.
* perfect-scrollbar is designed not to have width or height. It's fixed
  on the right and bottom side of the container.
* You can change nearly all css styles of the scrollbar. The scrollbar
  design has no dependency on scripts.
* perfect-scrollbar supports an 'update' function. Whenever you need
  to update the size or position of the scrollbar, just update.
* Additionally, perfect-scrollbar uses 'scrollTop' and 'scrollLeft',
  not absolute positioning or something messy.
* perfect-scrollbar supports RTL perfectly on both WebKit and Gecko based browsers.

It's cool, isn't it?

## Install

The best way to install and use perfect-scrollbar is with NPM.
It's registered on [npm](https://www.npmjs.org/package/perfect-scrollbar) as `perfect-scrollbar`.

```
$ npm install perfect-scrollbar
```

You can download the latest stable version with download links [here](http://noraesae.github.io/perfect-scrollbar/).
You also can find all releases on [Releases](https://github.com/noraesae/perfect-scrollbar/releases).

If you want to use the development version of the plugin, use the
source files which are not minified. They're in the `src` directory.
The development version may be unstable, but some known bugs may
have been fixed.

```
$ git clone https://github.com/noraesae/perfect-scrollbar.git
$ cd perfect-scrollbar/src
$ npm install
$ gulp # will lint and build the source code.
```


There is a Bower package for perfect-scrollbar as well. It is managed
under the [perfect-scrollbar-bower](https://github.com/noraesae/perfect-scrollbar-bower)
repository. The plugin is registered as `perfect-scrollbar`.

```
$ bower install perfect-scrollbar
```


You can also load it from [cdnjs](http://cdnjs.com/).
It is registered as [`jquery.perfect-scrollbar`](http://www.cdnjs.com/libraries/jquery.perfect-scrollbar).

## Requirements

To make this plugin *perfect*, some requirements were unavoidable.
But, they're all very trivial and there is nothing to worry about.

The following requirements should meet.

* the container must have a 'position' css style.

The following requirements are included in the basic CSS, but please
keep in mind when you'd like to change the CSS files.

* the container must have an 'overflow:hidden' css style.
* the scrollbar's position must be 'absolute'.
* the scrollbar-x must have a 'bottom' css style, and the scrollbar-y
  must have a 'right' css style.

## How to use

First of all, please check if the container element meets the
requirements.

```html
<link rel='stylesheet' href='dist/css/perfect-scrollbar.css' />
<style>
  #container {
    position: relative;
    height: 100%; /* Or whatever you want (eg. 400px) */
  }
</style>
```

I would recommend using the plugin with NPM and CommonJS module system
like Browserify.

```javascript
var Ps = require('perfect-scrollbar');
```

Or you can just load the script file as usual.

```html
<script src='dist/js/perfect-scrollbar.js'></script>
```

To initialise the plugin, `Ps.initialize` is used.

```javascript
var container = document.getElementById('container');
Ps.initialize(container);
```

It can be initialised with optional parameters.

```javascript
Ps.initialize(container, {
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
});
```

If the size of your container or content changes, call `update`.

```javascript
Ps.update(container);
```

If you want to destory the scrollbar, use `destroy`.

```javascript
Ps.destroy(container);
```

If you want to scroll to somewhere, just use a `scrollTop`
property and update.

```javascript
container.scrollTop = 0;
Ps.update(container);
```

You can also get information about how to use the plugin
from code in the `examples` directory of the source tree.

## jQuery

As you may already know, perfect-scrollbar was a jQuery plugin.
And it *is* as well. There's a jQuery adaptor and the plugin can
be used in the same way it used to be used before.

I also recommend using NPM and CommonJS here, but it's not mandatory.

```javascript
var $ = require('jquery');
require('perfect-scrollbar/jquery')($);
```

For sure, you can just import a built script.

```html
<script src='dist/js/perfect-scrollbar.jquery.js'></script>
```

After importing it, you can use the plugin in the usual way.

```javascript
$('#container').perfectScrollbar();          // Initialize
$('#container').perfectScrollbar({ ... });   // with options
$('#container').perfectScrollbar('update');  // Update
$('#container').perfectScrollbar('destroy'); // Destroy
```

## RequireJS  usage

For RequireJS loader, no need to write shim, simply import two libs:

```javascript
require.config({
  paths: {
    perfectScrollbarJQuery: '.../perfect-scrollbar.jquery',
    perfectScrollbar: '.../perfect-scrollbar',
  }
  ...
})
```


and load `perfectScrollbar` in the initialiser of your app:

```javascript
// for vanilla JS:
window.Ps = require('perfectScrollbar');

// for jQuery:
require('perfectScrollbarJQuery');
```


## AngularJS + RequireJS usage

With the require.config settings above, at the beginning of your app module
definition, you can have following code:

```javascript
define([
  'angular',
  'perfectScrollbar',
  'perfectScrollbarJquery'
],
function (angular) {
  var myApp = angular.module('myApp', [])
  .run(function() {
    window.Ps = require('perfectScrollbar');
    require('perfectScrollbarJQuery');
  })
  return myApp;
});
```

And initialise perfectScrollbar in a controller:

```javascript
// by vanilla JS:
var container = document.getElementById('imgLoader');
Ps.initialize(container);
Ps.update(container);

// or by jQuery:
var imgLoader = $("#imgLoader")
imgLoader.perfectScrollbar();
```

## Optional parameters

perfect-scrollbar supports optional parameters.

### wheelSpeed
The scroll speed applied to mousewheel event.  
**Default: 1**

### wheelPropagation
If this option is true, when the scroll reaches the end of the side, mousewheel event will be propagated to parent element.  
**Default: false**

### swipePropagation
If this option is true, when the scroll reaches the end of the side, touch scrolling will be propagated to parent element.  
**Default: true**

### minScrollbarLength
When set to an integer value, the thumb part of the scrollbar will not shrink below that number of pixels.  
**Default: null**

### maxScrollbarLength
When set to an integer value, the thumb part of the scrollbar will not expand over that number of pixels.  
**Default: null**

### useBothWheelAxes
When set to true, and only one (vertical or horizontal) scrollbar is visible then both vertical and horizontal scrolling will affect the scrollbar.  
**Default: false**

### useKeyboard
When set to true, the scroll works with arrow keys on the keyboard. The element is scrolled only when the mouse cursor hovers the element.  
**Default: true**

### suppressScrollX
When set to true, the scroll bar in X axis will not be available, regardless of the content width.  
**Default: false**

### suppressScrollY
When set to true, the scroll bar in Y axis will not be available, regardless of the content height.  
**Default: false**

### scrollXMarginOffset
The number of pixels the content width can surpass the container width without enabling the X axis scroll bar. Allows some "wiggle room" or "offset break", so that X axis scroll bar is not enabled just because of a few pixels.  
**Default: 0**

### scrollYMarginOffset
The number of pixels the content height can surpass the container height without enabling the Y axis scroll bar. Allows some "wiggle room" or "offset break", so that Y axis scroll bar is not enabled just because of a few pixels.  
**Default: 0**

### stopPropagationOnClick
When set to false, when clicking on a rail, the click event will be allowed to propagate.  
**Default: true**

### useSelectionScroll
When set to true, you can scroll the container by selecting text and move the cursor.  
**Default: false**

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
This event fires when scrolling reaches the end of the y-axis (useful for infinite scroll).

### ps-x-reach-start
This event fires when scrolling reaches the start of the x-axis.

### ps-x-reach-end
This event fires when scrolling reaches the end of the x-axis.

You can listen to these events either with vanilla JavaScript
```javascript
document.addEventListener('ps-scroll-x', function () {
  // ...
})
```
or with jQuery
```javascript
$(document).on('ps-scroll-x', function () {
  // ...
})
```

## Contribution

#### Please read [Contributing](https://github.com/noraesae/perfect-scrollbar/wiki/Contributing) in the wiki before making any contribution.


I *really* welcome contributions! Please feel free to fork and issue pull requests when...

* You have a very nice idea to improve this plugin!
* You found a bug!
* You're good at English and can help my bad English!

For IE problems, please refer to [IE Support](https://github.com/noraesae/perfect-scrollbar#ie-support).

## IE Support

The plugin would work in IEs >= IE9 (not well, though).

**The patches to fix problems in IE<=8 won't be accepted.**

When old IEs should be supported, please fork the project and
make patches personally.

## Helpdesk

If you have any idea to improve this project or any problem
using this, please feel free to upload an
[issue](https://github.com/noraesae/perfect-scrollbar/issues).

For common problems there is a
[FAQ](https://github.com/noraesae/perfect-scrollbar/wiki/FAQ) wiki page. Please check the page before uploading an issue.

## License

The MIT License (MIT) Copyright (c) 2015 Hyunje Alex Jun and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
