/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
((function($) {
    $.fn.perfectScrollbar = function(option) {
        if(option === 'update') {
            if($(this).data('perfect_scrollbar_update')) {
                $(this).data('perfect_scrollbar_update')();
            }
            return $(this);
        }
        else if(option === 'destroy') {
            if($(this).data('perfect_scrollbar_destroy')) {
                $(this).data('perfect_scrollbar_destroy')();
            }
            return $(this);
        }

        if($(this).data('perfect_scrollbar')) {
            // if there's already perfect_scrollbar
            return $(this).data('perfect_scrollbar');
        }

        var $this = $(this).addClass('ps-container'),
            $content = $(this).children(),
            $scrollbar_x = $("<div class='ps-scrollbar-x'></div>").appendTo($this),
            $scrollbar_y = $("<div class='ps-scrollbar-y'></div>").appendTo($this),
            container_width,
            container_height,
            content_width,
            content_height,
            scrollbar_x_width,
            scrollbar_x_left,
            scrollbar_x_bottom = parseInt($scrollbar_x.css('bottom')),
            scrollbar_y_height,
            scrollbar_y_top,
            scrollbar_y_right = parseInt($scrollbar_y.css('right'));

        var updateContentScrollTop = function() {
            var scroll_top = parseInt(scrollbar_y_top * content_height / container_height);
            $this.scrollTop(scroll_top);
            $scrollbar_x.css({bottom: scrollbar_x_bottom - scroll_top});
        };

        var updateContentScrollLeft = function() {
            var scroll_left = parseInt(scrollbar_x_left * content_width / container_width);
            $this.scrollLeft(scroll_left);
            $scrollbar_y.css({right: scrollbar_y_right - scroll_left});
        };

        var updateBarSizeAndPosition = function() {
            container_width = $this.width();
            container_height = $this.height();
            content_width = $content.width();
            content_height = $content.height();
            if(container_width < content_width) {
                scrollbar_x_width = parseInt(container_width * container_width / content_width);
                scrollbar_x_left = parseInt($this.scrollLeft() * container_width / content_width);
            }
            else {
                scrollbar_x_width = 0;
                scrollbar_x_left = 0;
                $this.scrollLeft(0);
            }
            if(container_height < content_height) {
                scrollbar_y_height = parseInt(container_height * container_height / content_height);
                scrollbar_y_top = parseInt($this.scrollTop() * container_height / content_height);
            }
            else {
                scrollbar_y_height = 0;
                scrollbar_y_left = 0;
                $this.scrollTop(0);
            }

            $scrollbar_x.css({left: scrollbar_x_left + $this.scrollLeft(), bottom: scrollbar_x_bottom - $this.scrollTop(), width: scrollbar_x_width});
            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop(), right: scrollbar_y_right - $this.scrollLeft(), height: scrollbar_y_height});
        };

        var moveBarX = function(current_left, delta_x) {
            var new_left = current_left + delta_x,
                max_left = container_width - scrollbar_x_width;

            if(new_left < 0) {
                scrollbar_x_left = 0;
            }
            else if(new_left > max_left) {
                scrollbar_x_left = max_left;
            }
            else {
                scrollbar_x_left = new_left;
            }
            $scrollbar_x.css({left: scrollbar_x_left + $this.scrollLeft()});
        }

        var moveBarY = function(current_top, delta_y) {
            var new_top = current_top + delta_y,
                max_top = container_height - scrollbar_y_height;

            if(new_top < 0) {
                scrollbar_y_top = 0;
            }
            else if(new_top > max_top) {
                scrollbar_y_top = max_top;
            }
            else {
                scrollbar_y_top = new_top;
            }
            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop()});
        };

        var bindMouseScrollXHandler = function() {
            var current_left,
                current_page_x;

            $scrollbar_x.bind('mousedown.perfect-scroll', function(e) {
                current_page_x = e.pageX;
                current_left = $scrollbar_x.position().left;
                $scrollbar_x.addClass('in-scrolling');
                e.stopPropagation();
                e.preventDefault();
            });

            $(document).bind('mousemove.perfect-scroll', function(e) {
                if($scrollbar_x.hasClass('in-scrolling')) {
                    moveBarX(current_left, e.pageX - current_page_x);
                    updateContentScrollLeft();
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(document).bind('mouseup.perfect-scroll', function(e) {
                if($scrollbar_x.hasClass('in-scrolling')) {
                    $scrollbar_x.removeClass('in-scrolling');
                }
            });
        };

        var bindMouseScrollYHandler = function() {
            var current_top,
                current_page_y;

            $scrollbar_y.bind('mousedown.perfect-scroll', function(e) {
                current_page_y = e.pageY;
                current_top = $scrollbar_y.position().top;
                $scrollbar_y.addClass('in-scrolling');
                e.stopPropagation();
                e.preventDefault();
            });

            $(document).bind('mousemove.perfect-scroll', function(e) {
                if($scrollbar_y.hasClass('in-scrolling')) {
                    moveBarY(current_top, e.pageY - current_page_y);
                    updateContentScrollTop();
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(document).bind('mouseup.perfect-scroll', function(e) {
                if($scrollbar_y.hasClass('in-scrolling')) {
                    $scrollbar_y.removeClass('in-scrolling');
                }
            });
        };

        // bind handlers
        var bindMouseWheelHandler = function() {
            $this.mousewheel(function(e, delta, deltaX, deltaY) {
                $this.scrollTop($this.scrollTop() - (deltaY * 10));
                $this.scrollLeft($this.scrollLeft() + (deltaX * 10));

                // update bar position
                updateBarSizeAndPosition();

                if(content_height > container_height || content_width > container_width) {
                    e.preventDefault();
                }
            });
        };

        var destroy = function() {
            $scrollbar_x.remove();
            $scrollbar_y.remove();
            $this.unbind('mousewheel');
            $(window).unbind('mousemove.perfect-scroll');
            $(window).unbind('mouseup.perfect-scroll');
            $this.data('perfect_scrollbar', null);
            $this.data('perfect_scrollbar_update', null);
            $this.data('perfect_scrollbar_destroy', null);
        };

        var initialize = function() {
            updateBarSizeAndPosition();
            bindMouseScrollXHandler();
            bindMouseScrollYHandler();
            if($this.mousewheel) bindMouseWheelHandler();
            $this.data('perfect_scrollbar', $this);
            $this.data('perfect_scrollbar_update', updateBarSizeAndPosition);
            $this.data('perfect_scrollbar_destroy', destroy);
        };

        // initialize
        initialize();

        return $this;
    };
})(jQuery));
