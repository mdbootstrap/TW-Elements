/**
  * perfect-scrollbar v1.0.0-dev
  * (c) 2017 Hyunje Jun
  * @license MIT
  */
var defaultOptions = function () { return ({
    handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: false,
    suppressScrollY: false,
    swipePropagation: true,
    swipeEasing: true,
    useBothWheelAxes: false,
    wheelPropagation: false,
    wheelSpeed: 1,
}); };

var ScrollEmulation = (function () {
    function ScrollEmulation(ps) {
        this.ps = ps;
        this.init();
    }
    return ScrollEmulation;
}());

function remove(element) {
    if (typeof element.remove === 'function') {
        element.remove();
    }
    else if (element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

var Scrollbar = (function () {
    function Scrollbar(axis, options) {
        this.axis = axis;
        this.options = options;
        this.railEl = document.createElement('div');
        this.thumbEl = document.createElement('div');
        this.railEl.className = "ps_scrollbar--" + this.axis + "-rail";
        this.thumbEl.className = "ps_scrollbar--" + this.axis;
    }
    Scrollbar.prototype.isInstalledAt = function (container) {
        return this.railEl.parentElement === container;
    };
    Scrollbar.prototype.appendTo = function (container) {
        this.railEl.appendChild(this.thumbEl);
        container.appendChild(this.railEl);
    };
    Scrollbar.prototype.destroy = function () {
        remove(this.thumbEl);
        remove(this.railEl);
    };
    return Scrollbar;
}());

var __extends = (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
// FIXME
var DummyEmulation = (function (_super) {
    __extends(DummyEmulation, _super);
    function DummyEmulation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyEmulation.prototype.init = function () { };
    DummyEmulation.prototype.destroy = function () { };
    return DummyEmulation;
}(ScrollEmulation));
// FIXME
var emulationDict = {
    'click-rail': DummyEmulation,
    'drag-scrollbar': DummyEmulation,
    keyboard: DummyEmulation,
    wheel: DummyEmulation,
    touch: DummyEmulation,
    selection: DummyEmulation,
};
var PerfectScrollbar = (function () {
    function PerfectScrollbar(el, options) {
        var _this = this;
        // method binds
        this.update = this.update.bind(this);
        this.el = el;
        this.options = __assign({}, defaultOptions(), options);
        this.scrollbarX = new Scrollbar('x', this.options);
        this.scrollbarY = new Scrollbar('y', this.options);
        this.el.classList.add('ps');
        this.emulations = this.options.handlers.map(function (handler) {
            var Emulation = emulationDict[handler];
            return new Emulation(_this);
        });
        this.el.addEventListener('scroll', this.update);
        this.update();
    }
    Object.defineProperty(PerfectScrollbar.prototype, "scrollbars", {
        get: function () {
            return [this.scrollbarX, this.scrollbarY];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerfectScrollbar.prototype, "document", {
        get: function () {
            return this.el.ownerDocument || document;
        },
        enumerable: true,
        configurable: true
    });
    PerfectScrollbar.prototype.update = function () {
        var _this = this;
        this.scrollbars.forEach(function (scrollbar) {
            if (!scrollbar.isInstalledAt(_this.el)) {
                scrollbar.appendTo(_this.el);
            }
        });
    };
    PerfectScrollbar.prototype.destroy = function () {
        this.el.removeEventListener('scroll', this.update);
        // destroy scrollbars
        this.scrollbars.forEach(function (scrollbar) { return scrollbar.destroy(); });
        // destory emulations
        this.emulations.forEach(function (emu) { return emu.destroy(); });
    };
    return PerfectScrollbar;
}());

export default PerfectScrollbar;
