import * as instances from '../instances';
import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function(e) {
    e.stopPropagation();
  };

  i.event.bind(i.scrollbarY, 'click', stopPropagation);
  i.event.bind(i.scrollbarYRail, 'click', function(e) {
    var positionTop =
      e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(
      element,
      'top',
      element.scrollTop + direction * i.containerHeight
    );
    updateGeometry(element);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'click', stopPropagation);
  i.event.bind(i.scrollbarXRail, 'click', function(e) {
    var positionLeft =
      e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(
      element,
      'left',
      element.scrollLeft + direction * i.containerWidth
    );
    updateGeometry(element);

    e.stopPropagation();
  });
}

export default function(element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
}
