import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const HeaderScript = () => {
    let scriptRef;

    const toggleNav = (toOpen) => {
        let dur = 1;
        let elToActive = toOpen ? document.querySelector('.header__toggle-close') : document.querySelector('.header__toggle-open');
        let elToDeactive = toOpen ? document.querySelector('.header__toggle-open') : document.querySelector('.header__toggle-close');
        document.querySelector('.header__toggle').classList.add('ev-none');
        gsap.fromTo(elToActive, {yPercent: 100}, { yPercent: 0, duration: dur, ease: 'power2.inOut'});
        gsap.fromTo(elToDeactive, {yPercent: 0}, { yPercent: -100, duration: dur, ease: 'power2.inOut'});
        setTimeout(() => {
            document.querySelector('.header__toggle').classList.remove('ev-none');
        }, dur * 1000);
    }

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();

        let nav = document.querySelector('.nav');
        gsap.set(document.querySelector('.header__toggle-close'), {yPercent: 100})
        const navToggleHandler = (e) => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                toggleNav(false);
            } else {
                nav.classList.add('active');
                toggleNav(true);
            }
        };

        const menuLinkHandler = (e) => {
            setTimeout(() => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    toggleNav(false);
                }
            }, 500);
        };

        if (window.innerWidth <= 767) {
            document.querySelector('.header__toggle').addEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.addEventListener('click', menuLinkHandler));
        }

        // if (window.location.pathname !== '/') {
        //     gsap.fromTo('.header__name', { autoAlpha: 1, yPercent: -200 }, { autoAlpha: 1, yPercent: -100, duration: 1, ease: 'power2.inOut' })
        // }
        // else {
        //     gsap.to('.header__greating', { autoAlpha: 1, ease: 'power2.inOut' });
        // }

        onCleanup(() => {
            document.querySelector('.header__toggle').removeEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.removeEventListener('click', menuLinkHandler));
        })
    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
