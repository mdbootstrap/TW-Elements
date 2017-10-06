import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';

export default function(i) {
  const element = i.element;

  i.event.bind(i.scrollbarY, 'mousedown', e => e.stopPropagation());
  i.event.bind(i.scrollbarYRail, 'mousedown', e => {
    const positionTop =
      e.pageY -
      window.pageYOffset -
      i.scrollbarYRail.getBoundingClientRect().top;
    const direction = positionTop > i.scrollbarYTop ? 1 : -1;

    updateScroll(i, 'top', element.scrollTop + direction * i.containerHeight);
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', e => e.stopPropagation());
  i.event.bind(i.scrollbarXRail, 'mousedown', e => {
    const positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail.getBoundingClientRect().left;
    const direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    updateScroll(i, 'left', element.scrollLeft + direction * i.containerWidth);
    updateGeometry(i);

    e.stopPropagation();
  });
}
