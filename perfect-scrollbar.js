/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
((function($) {
    $.fn.perfectScrollbar = function() {
        var $this = $(this),
            $content = $(this).children(),
            $scrollbar_y = $("<div class='ps-scrollbar-y'></div>").appendTo($this),
            container_height,
            content_height,
            scrollbar_y_height,
            scrollbar_y_top;

        // add class
        $this.addClass('ps-container');

        var updateContentScrollTop = function() {
            $this.scrollTop(parseInt(scrollbar_y_top * content_height / container_height));
        };

        var updateBarSizeAndPosition = function() {
            container_height = $this.height();
            content_height = $content.height();
            scrollbar_y_height = parseInt(container_height * container_height / content_height);
            scrollbar_y_top = parseInt($this.scrollTop() * container_height / content_height);

            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop(), height: scrollbar_y_height});
        };

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

            $(window).bind('mousemove.perfect-scroll', function(e) {
                if($scrollbar_y.hasClass('in-scrolling')) {
                    moveBarY(current_top, e.pageY - current_page_y);
                    updateContentScrollTop();
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(window).bind('mouseup.perfect-scroll', function(e) {
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

                e.preventDefault();
            });
        };

        // initialize
        updateBarSizeAndPosition();
        bindMouseScrollYHandler();
        if($this.mousewheel) bindMouseWheelHandler();

        return $this;
    };
})(jQuery));
