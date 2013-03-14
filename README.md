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

Requirements
------------

To make this plugin *perfect*, some requirements were not avoidable. But they're all very trivial and there's nothing to worry about.

* there must be the *one* content element(like div) for the container.
* the container must have a 'position' css style.
* the scrollbar's position must be 'absolute'.
* the scrollbar-x must have a 'bottom' css style, and the scrollbar-y must have a 'right' css style.
 
Optional parameters
-------------------

perfect-scrollbar supports optional parameters.

### wheelSpeed
The scroll speed applied to mousewheel event.  
Default: 10

### wheelPropagation
If this option is true, when the scroll reach the end of the side, mousewheel event will be propagated to parent element.  
Default: false


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
  wheelPropagation: true
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

Very helpful friends
--------------------

perfect-scrollbar supports [jquery-mousewheel](https://github.com/brandonaaron/jquery-mousewheel). If you want to use mousewheel features, please include jquery-mousewheel before using perfect-scrollbar.

If you want to make this plugin's update function more responsive, [jquery-resize](https://github.com/cowboy/jquery-resize) can be helpful.

Contribution
------------

I *really* welcome contributions! Please feel free to fork and issue pull requests when...

* You have a very nice idea to improve this plugin!
* You found a bug!
* You're good at English and can help my bad English!

Also you can just open issues, and I can look into them.

License
-------

The MIT License (MIT) Copyright (c) 2012 HyeonJe Jun.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**It means, you can freely fork and modify this project for commercial or non-comercial use!**

Helpdesk
--------

If you have any idea to improve this project or any problems using this, please feel free to contact me.  
Email: noraesae@yuiazu.net
