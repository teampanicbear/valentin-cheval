import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

function initScrollTrigger() {
  gsap.registerPlugin(ScrollTrigger);
  if (window.innerWidth <= 767) {
    ScrollTrigger.defaults({
      scroller: '.wrapper',
    });
  }
}

export { initScrollTrigger };
