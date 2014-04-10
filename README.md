perfect-scrollbar
=================

Tiny but perfect jQuery scrollbar plugin

Why perfect-scrollbar?
------------------

I worked on the personal project recently, and I was trying to find the jQuery scrollbar plugin that's *perfect*. But there was no *perfect* scrollbar plugin. That's why I decided to make one.

perfect-scrollbar is very tiny but *perfect*(for me, and maybe for the most of developers) jQuery scrollbar plugin.  
I hope you love this!

Demo: http://noraesae.github.com/perfect-scrollbar/

What means *perfect*?
---------------------

*perfect* means...

* There should be no css change on any original element.
* The scrollbar should not affect the original design layout.
* The design of the scrollbar should be (nearly) fully customizable.
* If the size of the container or the content changes, the scrollbar size and position should be able to change.

Then perfect-scrollbar is really *perfect*?
-------------------------------------------

Yes! the only thing that's not *perfect* is my English.

* perfect-scrollbar has some requirements, but doesn't change or add any style on original elements.
* perfect-scrollbar is designed not to have width or height. It's fixed on the right and bottom side of the container.
* You can change nearly all css styles of the scrollbar. The scrollbar design has no dependency on scripts.
* perfect-scrollbar support 'update' function. Whenever you need to update the size or position of the scrollbar, just update.
* Additionally, perfect-scrollbar do use 'scrollTop' and 'scrollLeft', not absolute position or something messy.

It's cool, isn't it?

Install
-------

You can download the latest stable version with download links in [Github Page](http://noraesae.github.io/perfect-scrollbar/). You also can find all releases in [Releases](https://github.com/noraesae/perfect-scrollbar/releases) page.

If you want to use the development version of the plugin, use the source files which are not minified. They're in the `src` directory. The development version may be unstable, but some known bugs can be fixed.

```
git clone https://github.com/noraesae/perfect-scrollbar.git
cd perfect-scrollbar/src
```

You can use [Bower](http://bower.io/) to install the plugin. The plugin is registered as `perfect-scrollbar`.

```
bower install perfect-scrollbar
```

Requirements
------------

To make this plugin *perfect*, some requirements were not avoidable. But they're all very trivial and there's nothing to worry about.

* the container must have a 'position' css style.
* the container must have an 'overflow:hidden' css style.
* the scrollbar's position must be 'absolute'.
* the scrollbar-x must have a 'bottom' css style, and the scrollbar-y must have a 'right' css style.

The requirement below is for perfect-scrollbar &lt;= 0.3.4

* there must be the *one* content element(like div) for the container.
 
Optional parameters
-------------------

perfect-scrollbar supports optional parameters.

### wheelSpeed
The scroll speed applied to mousewheel event.  
**Default: 10**

### wheelPropagation
If this option is true, when the scroll reach the end of the side, mousewheel event will be propagated to parent element.  
**Default: false**

### minScrollbarLength
When set to an integer value, the thumb part of the scrollbar will not shrink below that number of pixels.  
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

### includePadding
When set to true, it uses `innerWidth` and `innerHeight` for the container size instead of `width` and `height`. When your container element has non-zero padding and the scrollbar layout looks weird, this option can be helpful.  
**Default: false**

How to Use
----------

```html
<style>
  #Demo { position: 'relative'; }
</style>
<div id='Demo'>
  <div>
    ...
  </div>
</div>
```
When the html document is like above, just use like this:
```javascript
$('#Demo').perfectScrollbar();
```

With optional parameters:
```javascript
$("#Demo").perfectScrollbar({
  wheelSpeed: 20,
  wheelPropagation: true,
  minScrollbarLength: 20
})
```

If the size of your container or content changes:
```javascript
$('#Demo').perfectScrollbar('update');
```
If you want to destory the scrollbar:
```javascript
$('#Demo').perfectScrollbar('destroy');
```

If you want to scroll to somewhere, just use scroll-top css and update.
```javascript
$("#Demo").scrollTop(0);
$("#Demo").perfectScrollbar('update');
```

Also you can get the informations about how to use the plugin from example codes in the `examples` directory of the source tree.

Very helpful friends
--------------------

perfect-scrollbar supports [jquery-mousewheel](https://github.com/brandonaaron/jquery-mousewheel). If you want to use mousewheel features, please include jquery-mousewheel before using perfect-scrollbar.

If you want to make this plugin's update function more responsive, [jquery-resize](https://github.com/cowboy/jquery-resize) can be helpful.

Contribution
------------

#### Please read [Contributing](https://github.com/noraesae/perfect-scrollbar/wiki/Contributing) in the wiki before making any contibution.


I *really* welcome contributions! Please feel free to fork and issue pull requests when...

* You have a very nice idea to improve this plugin!
* You found a bug!
* You're good at English and can help my bad English!

For IE problems, please refer to [IE Support](https://github.com/noraesae/perfect-scrollbar#ie-support)

IE Support
----------

This plugin supports old IE browsers in the **minimum** range. The plugin is tested in IEs >= IE6 and works(not well, but works).

**But the project will not accept the patches to fix IE problems in IE 6/7/8.**

From jQuery 2.0, jQuery also will not support IE 6/7/8. I also think that supporting old browsers really breaks the web development conventions.

When old IEs should be supported, please fork the project and make patches personally.

Helpdesk
--------

If you have any idea to improve this project or any problem using this, please feel free to upload an [issue](https://github.com/noraesae/perfect-scrollbar/issues).

License
-------

The MIT License (MIT) Copyright (c) 2012, 2014 Hyeonje Alex Jun and other contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
