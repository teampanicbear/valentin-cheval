import { onMount } from "solid-js";
import gsap from "gsap";
import { initScrollTrigger } from "~/components/core/scrollTrigger";

const HeroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        let isLoaded = sessionStorage.getItem("isLoaded") == 'true' ? true : false;

        let delayLoading = isLoaded ? 1 : 3.2;
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__hero-main-img',
                start: `top-=${document.querySelector('.about__hero-main-img').getBoundingClientRect().top + (window.innerWidth > 991 ? 0 : 1)}px top`,
                end: 'center top',
                scrub: window.innerWidth > 991 ? true : false
            },
            delay: window.innerWidth > 991 ? 0 : delayLoading,
        })
        tl
            .fromTo('.about__hero-main-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 })
            .fromTo('.about__hero-main-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1, ease: 'power1.out', duration: 1.2  }, "<=0")
            .fromTo('.about__hero-sub-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 2 })
            .fromTo('.about__hero-sub-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1 , duration: 2.4, ease: 'power1.out'}, "<=0")

        if (window.innerWidth <= 767) {
            gsap.set('.about__hero-sub-img', { top: (window.innerHeight - document.querySelector('.about__hero-sub-img').offsetHeight) / 2 })
        }
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;