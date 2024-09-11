import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { cvUnit } from '~/utils/number';
import gsap from 'gsap';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const IntroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        const GRID_COL = window.innerWidth <= 991 ? window.innerWidth <= 767 ? 1 : 3 : 5;
        let emptySpace = (document.querySelector('.container-col').offsetWidth + cvUnit(20, 'rem')) * GRID_COL
        document.querySelector('.about__intro-vision-empty').style.width = `${emptySpace}px`;

        const text = SplitType.create('.about__intro-vision-content-txt', { types: 'lines, words', lineClass: 'split-line-blur' });
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__intro-vision-content',
                start: `top bottom-=${window.innerWidth > 991 ? 10 : 40}%`,
                end: 'bottom center+=10%',
                scrub: true,
            }
        });

        tl
            .fromTo(text.words, { autoAlpha: .15, yPercent: 5 }, {stagger:.4, autoAlpha: 1, yPercent: 0,  duration: 5.5, ease: 'back.out(2.0)' }, 0)
            .to(text.words, {keyframes: {
                filter: ['blur(0px)', 'blur(6px)', 'blur(0px)'],
            }, stagger:.4, duration: 5.5,  ease: 'back.out(2.0)', }, 0)

        let tlPassion = gsap.timeline({
            scrollTrigger: {
                once: true,
                trigger: '.about__intro-passion-listing',
                start: 'top top+=70%',
                end: 'bottom bottom',
            }
        });
        tlPassion.from('.about__intro-passion-listing', {'--distance': '0%', autoAlpha: 0, scale: .8, duration: 1.4, ease: 'power2.out'})
        .from('.about__intro-passion-circle-txt', {autoAlpha: 0, yPercent: 100, duration: 1.4, ease: 'power2.out', stagger: .1, clearProps: 'all'}, '<=.2')


        onCleanup(() => {
            tl.kill();
            tlPassion.kill();
            text.revert();
        })
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;