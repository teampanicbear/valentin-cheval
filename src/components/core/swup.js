import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

import { getCursor, initMouseFollower } from './cursor';
import { applyOnScroll, getLenis, initLenis, reInitLenisScroll } from './lenis';
import { checkIsPostPage } from '~/utils/permalinks';
import Lenis from 'lenis';

function forceScrollTop() {
  getLenis().scrollTo('top', { duration: 0.001 });

  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  if (window.innerWidth > 767) {
    window.scrollTo(0, 0);
  } else {
    document.querySelector('.wrapper').scrollTo(0, 0);
  }
}

function updateHeader() {
  if (window.innerWidth <= 767) return;
  const links = document.querySelectorAll('.header__menu-link');

  Array.prototype.forEach.call(links, function (link) {
    const href = link.getAttribute('href').toString();
    const path = window.location.pathname;
    const delTrailingSplash = (text) => (text.endsWith('/') ? text.slice(0, -1) : text);
    link.classList.remove('active');
    delTrailingSplash(href) === delTrailingSplash(path) && link.classList.add('active');
  });
}

function resetTransition(url) {
  function projectTransition() {
    const transitionDOM = (attr) => document.querySelector(`[data-project-${attr}]`);

    if (!checkIsPostPage(url)) {
      document.querySelector('.header__menu-item.grid-1-1').classList.remove('on-scroller');
      document.querySelector('.header__back').classList.remove('on-scroller');
    }
  }
  projectTransition();
}

let registeredEvents = [];

function removeRenderingEventListeners() {
  registeredEvents.forEach(({ type, handler, element }) => {
    if (!element) console.log(element);
    element.removeEventListener(type, handler);
  });
  registeredEvents = []; // Xóa mảng sau khi đã remove
}

function initSwup() {
  forceScrollTop();
  window.swup.hooks.on('page:view', (visit) => {
    console.log('New page loaded:', visit.to.url);

    resetTransition(visit.to.url);

    let isProjectPage = visit.to.url === '/projects' || checkIsPostPage(visit.to.url);
    let isInfinite = document.querySelector('[data-infinite]') !== null;

    let lenis = window.innerWidth > 991 ? initLenis({ infinite: isInfinite }) : getLenis();
    reInitLenisScroll(lenis, isProjectPage);

    forceScrollTop();
    if (window.innerWidth > 991) {
      if (!isProjectPage) {
        getCursor().follower.destroy();
        initMouseFollower();
      }
    }
  });

  window.swup.hooks.on('enable', () => {});

  window.swup.hooks.on('visit:start', (visit) => {
    console.log('visit:start', window.location.href);
  });

  window.swup.hooks.on(
    'content:replace',
    () => {
      updateHeader();
      forceScrollTop();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollTrigger.clearMatchMedia();
      removeRenderingEventListeners();
    },
    { before: true }
  );
}

export { initSwup, registeredEvents };
