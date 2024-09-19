import Swup from 'swup';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

import { getCursor, initMouseFollower } from './cursor';
import { applyOnScroll, getLenis, initLenis, reInitLenisScroll } from './lenis';

import SwupRouteNamePlugin from '@swup/route-name-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import { checkIsPostPage } from '~/utils/permalinks';
import Lenis from 'lenis';

let swup;

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
    link.classList.remove('active');
    link.getAttribute('href') === window.location.pathname && link.classList.add('active');
  });
}

function resetTransition(url) {
  function projectTransition() {
    const transitionDOM = (attr) => document.querySelector(`[data-project-${attr}]`);

    if (!checkIsPostPage(url)) {
      // if (document.querySelector('.project__transition').classList.contains('can-return')) return;
      // document.querySelector('.project__transition').removeAttribute('style');
      // transitionDOM('name').innerHTML = '';
      // transitionDOM('name').removeAttribute('style');
      // transitionDOM('info').removeAttribute('style');
      // transitionDOM('info-role').innerHTML = '';
      // transitionDOM('info-service').innerHTML = '';
      // transitionDOM('info-selling').innerHTML = '';
      // transitionDOM('thumbnail').innerHTML = '';
      // transitionDOM('thumbnail').removeAttribute('style');
      // transitionDOM('year').querySelector('.project__transition-year-current').innerHTML = '';
      // transitionDOM('year').removeAttribute('style');
    }
  }

  projectTransition();
}

function initSwup() {
  forceScrollTop();
  swup = new Swup({
    containers: ['main'],
    plugins: [
      new SwupRouteNamePlugin({
        routes: [
          { name: 'home', path: '/' },
          { name: 'projects', path: '/projects' },
          { name: 'project', path: '/project/:slug' },
          { name: 'any', path: '(.*)' },
        ],
      }),
      new SwupPreloadPlugin(),
    ],
  });

  swup.hooks.on('page:view', (visit) => {
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

  swup.hooks.on('enable', () => {});

  swup.hooks.on('visit:start', (visit) => {
    console.log('visit:start', window.location.href);
  });

  swup.hooks.on(
    'content:replace',
    () => {
      updateHeader();
      forceScrollTop();
      ScrollTrigger.getAll().forEach((e) => e.kill());
      ScrollTrigger.clearMatchMedia();
    },
    { before: true }
  );
}

function getSwup() {
  if (!swup) {
    initSwup();
  }
  return swup;
}

export { initSwup, getSwup };
