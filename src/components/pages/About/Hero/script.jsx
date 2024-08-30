import { onMount } from "solid-js";
import gsap from "gsap";
import { initScrollTrigger } from "~/components/core/scrollTrigger";

const HeroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__hero-main-img',
                start: `top-=${document.querySelector('.about__hero-main-img').getBoundingClientRect().top}px top`,
                end: 'bottom top',
                scrub: true
            },
            defaults: {
                duration: 1
            }
        })
        tl
            .fromTo('.about__hero-main-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'})
            .fromTo('.about__hero-main-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1.2  }, "<=0")
            .fromTo('.about__hero-sub-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' })
            .fromTo('.about__hero-sub-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1.2 }, "<=0")
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;