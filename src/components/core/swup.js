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
    getLenis().scrollTo("top", { duration: .001 });

    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }
    if (window.innerWidth > 767) {
        window.scrollTo(0, 0);
    }
    else {
        document.querySelector('.wrapper').scrollTo(0, 0);
    }
}

function updateHeader() {
    console.log("update header")
    const links = window.innerWidth > 767 ? document.querySelectorAll('.header__menu-link') : document.querySelectorAll('.nav__menu-link');
    Array.prototype.forEach.call(links, function (link) {
        link.classList.remove("active");
        link.getAttribute('href') === window.location.pathname && link.classList.add("active");
    });
}

function resetTransition(url) {
    function projectTransition() {
        const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

        if (!checkIsPostPage(url)) {
            document.querySelector('.project__transition').removeAttribute('style');
            document.querySelector('.project__transition .project__thumbnail-img-inner')?.remove();

            transitionDOM('name').innerHTML = '';
            transitionDOM('name').removeAttribute('style');

            transitionDOM('info').innerHTML = '';
            transitionDOM('info').removeAttribute('style');

            transitionDOM('year').innerHTML = '';
            transitionDOM('year').removeAttribute('style');
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
                    { name: 'any', path: '(.*)' }
                ]
            }),
            new SwupPreloadPlugin()
        ]
    });

    swup.hooks.on('page:view', (visit) => {
        console.log('New page loaded:', visit.to.url);

        resetTransition(visit.to.url);

        let isProjectPage = visit.to.url === '/projects' || checkIsPostPage(visit.to.url);

        let lenis = window.innerWidth > 991 ? initLenis({ infinite: !isProjectPage }) : getLenis();
        reInitLenisScroll(lenis, isProjectPage);

        forceScrollTop();
        if (window.innerWidth > 991) {
            if (!isProjectPage) {
                getCursor().follower.destroy();
                initMouseFollower();
            }
        }
    });

    swup.hooks.on('enable', () => {
    })

    swup.hooks.on('visit:start', (visit) => {
        console.log("visit:start", window.location.href)
    });

    swup.hooks.on('content:replace', () => {
        updateHeader();
        forceScrollTop();
        ScrollTrigger.getAll().forEach((e) => e.kill());
        ScrollTrigger.clearMatchMedia();
    }, { before: true });
}

function getSwup() {
    if (!swup) {
        initSwup();
    }
    return swup;
}

export { initSwup, getSwup }