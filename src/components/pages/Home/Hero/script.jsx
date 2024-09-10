import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { cvUnit } from '~/utils/number';

const HeroScript = (props) => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__hero-bg',
                start: 'top top',
                end: 'bottom+=500px bottom',
                scrub: true,
                onToggle(self) {
                    if (self.isActive) {
                        document.querySelector('.home-footer-hero').classList.add('force-footer');
                    } else {
                        document.querySelector('.home-footer-hero').classList.remove('force-footer');
                    }
                }
            }
        })
        tl
            .fromTo('.home__hero-bg-main-wrap', { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.7, xPercent: 5, yPercent: -8, duration: 2, ease: 'linear' })
            .fromTo('.home__hero-bg-main-inner-bg img', { scale: 1}, { scale: .6, duration: 2, ease: 'linear' }, 0)
            .fromTo('.home__hero-title-wrap, .home__hero-scope-wrap, .home__hero-intro-wrap', { autoAlpha: 1 }, { autoAlpha: 1, stagger: .1, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main-wrap', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: window.innerWidth > 767 ? 20 : 0, duration: 1, ease: 'linear' }, "<.3")
            .to('.home__intro-bg-gradient', { display: 'none', duration: 0, ease: 'linear' })
        onCleanup(() => {
            tl.kill();
        });
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;