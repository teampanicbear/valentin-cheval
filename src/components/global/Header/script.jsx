import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getCursor } from '~/components/core/cursor';
import SplitType from 'split-type';

const HeaderScript = () => {
    let scriptRef;

    const toggleNav = (toOpen, nav) => {
        let dur = 1;
        let elToActive = toOpen ? document.querySelector('.header__toggle-close') : document.querySelector('.header__toggle-open');
        let elToDeactive = toOpen ? document.querySelector('.header__toggle-open') : document.querySelector('.header__toggle-close');

        gsap.fromTo(elToActive, {yPercent: 100}, { yPercent: 0, duration: dur, ease: 'power2.inOut'});
        gsap.fromTo(elToDeactive, { yPercent: 0 }, { yPercent: -100, duration: dur, ease: 'power2.inOut' });
        if (toOpen) {
            nav.classList.add('active');
            gsap.timeline({
                onStart: () => {document.querySelector('.header__toggle').classList.add('ev-none');},
                onComplete: () => {document.querySelector('.header__toggle').classList.remove('ev-none');}
            })
            .fromTo('.nav__menu-link .txt', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: dur, ease: 'power2.inOut', stagger: .05})
            .fromTo('.nav .line', { autoAlpha: 0, scaleX: 0, transformOrigin: 'left' }, { autoAlpha: 1, scaleX: 1, duration: dur, ease: 'power2.inOut'}, '<=.1')
            .fromTo('.nav__socials > *', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: dur * .8, ease: 'power2.inOut', stagger: .03}, '<=.1')
            .fromTo('.nav__act .word', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: dur * .8, ease: 'power2.inOut', stagger: .03}, '<=.1')
        } else {
            gsap.timeline({
                onStart: () => {document.querySelector('.header__toggle').classList.add('ev-none');},
                onComplete: () => {document.querySelector('.header__toggle').classList.remove('ev-none');}
            })
            .to('.nav__menu-link .txt', { autoAlpha: 0, yPercent: 100, duration: dur, ease: 'power2.inOut', stagger: -.05})
            .to('.nav .line', { autoAlpha: 0, scaleX: 0, transformOrigin: 'right', duration: dur, ease: 'power2.inOut'}, '<=.1')
            .to('.nav__socials > *', { autoAlpha: 0, yPercent: 100, duration: dur * .8, ease: 'power2.inOut', stagger: -.03}, '<=.1')
            .to('.nav__act .word', { autoAlpha: 0, yPercent: 100, duration: dur * .8, ease: 'power2.inOut', stagger: -.03}, '<=.1')
            nav.classList.remove('active');
        }
    }
    function getGreating() {
        let now = new Date();
        let hour = now.getHours();
        let greating = '';
        if (hour < 12) {
            greating = 'morning';
        } else if (hour < 18) {
            greating = 'afternoon';
        } else {
            greating = 'evening';
        }
        console.log(document.querySelector('.time-great'))
        document.querySelector('.time-great').innerHTML = greating;
    }

    onMount(() => {
        if (!scriptRef) return;
        getGreating();
        initScrollTrigger();

        let nav = document.querySelector('.nav');
        let navActTxt = new SplitType('.nav__act', { types: 'lines, words', lineClass: 'split-line' });
        gsap.set(document.querySelector('.header__toggle-close'), {yPercent: 100})
        const navToggleHandler = (e) => {
            if (nav.classList.contains('active')) {
                toggleNav(false, nav);
            } else {
                toggleNav(true, nav);
            }
        };

        const menuLinkHandler = (e) => {
            document.querySelectorAll('.nav__menu-link').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            setTimeout(() => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    toggleNav(false, nav);
                }
            }, 500);
        };

        if (window.innerWidth <= 767) {
            document.querySelector('.header__toggle').addEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.addEventListener('click', menuLinkHandler));
        }

        onCleanup(() => {
            document.querySelector('.header__toggle').removeEventListener('click', navToggleHandler);
            document.querySelectorAll('.nav__menu-link').forEach((el) => el.removeEventListener('click', menuLinkHandler));
        })
    })
    return (<div ref={scriptRef} class="divScript"></div>)
}
export default HeaderScript;
