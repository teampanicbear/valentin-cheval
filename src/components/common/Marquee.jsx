import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getLenis } from '~/components/core/lenis';

const Marquee = (props) => {
  let marqueeRef;
  onMount(() => {
    if (!marqueeRef) return;

    const q = gsap.utils.selector(marqueeRef);
    const DOM = {
      wrap: q('.marquee'),
      list: q('.marquee-inner'),
      item: q('.marquee-inner-item'),
    };

    let cloneAmount = 1;
    const cloneAdditional = Math.floor(window.innerWidth / DOM.item.offsetWidth);
    if (cloneAdditional >= 1) {
      cloneAmount += cloneAdditional;
    }
    new Array(cloneAmount).fill().forEach((_, index) => {
      let itemClone = DOM.item[0].cloneNode(true);
      DOM.list[0].appendChild(itemClone);
    });

    let distance = DOM.item[0].offsetWidth;

    const direction = { right: '-1', left: '1' };

    function animationMarquee() {
      let xTarget = gsap.getProperty(DOM.list[0], 'x');
      if (xTarget < -distance) {
        xTarget = 0;
      } else if (xTarget > 0) {
        xTarget = -distance;
      }
      let tlDir = getLenis().direction >= 0 ? 1 : -1;
      gsap.quickSetter(
        DOM.list[0],
        'x',
        'px'
      )(
        xTarget +
          (getLenis().velocity * (window.innerWidth > 991 ? 1 : 0.1) +
            tlDir * (Number(props.duration) || 3)) *
            direction[props.start || 'left']
      );

      requestAnimationFrame(animationMarquee);
    }
    requestAnimationFrame(animationMarquee);

    onCleanup(() => {});
  });
  return (
    <div ref={marqueeRef}>
      <div class="marquee">
        <div class="marquee-inner">
          <div class="marquee-inner-item">{props.children}</div>
        </div>
      </div>
    </div>
  );
};
export default Marquee;
