/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
((function($) {
    $.fn.perfectScrollbar = function() {
        $(this).mousewheel(function(e, delta, deltaX, deltaY) {
            $(this).scrollTop($(this).scrollTop() - (deltaY * 10));
            $(this).scrollLeft($(this).scrollLeft() + (deltaX * 10));
            e.preventDefault();
        });
    };
})(jQuery));
