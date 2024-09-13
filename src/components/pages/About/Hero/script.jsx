import { onCleanup, onMount } from "solid-js";
import gsap from "gsap";
import { initScrollTrigger } from "~/components/core/scrollTrigger";
import { splitTextFadeUp } from "~/utils/gsap";
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const HeroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        let isLoaded = sessionStorage.getItem("isLoaded") == 'true' ? true : false;

        let delayLoading = isLoaded ? 1 : 3.2;
        let tl;
        let tlShow;

        gsap.set('.about__hero-main-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)'});
        gsap.set('.about__hero-main-img img', { xPercent: -25, yPercent: -25, scale: 1.4 });
        gsap.set('.about__hero-title-txt .copyright', { autoAlpha: 0, yPercent: 100, duration: 0 });
        gsap.set('.about__hero-main-intro .line', { scaleX: 0, transformOrigin: 'left', duration: 0 });

        let title = splitTextFadeUp('.about__hero-title-txt span');
        let year = splitTextFadeUp('.about__hero-title-year');
        let intro = splitTextFadeUp('.about__hero-main-intro .heading');

        const fadeContent = (delay) => {
            tlShow = gsap.timeline({
                defaults: { ease: 'power2.out' },
                delay: delay || 0,
                onComplete() {
                    if (window.innerWidth > 991) {
                        ScrollTrigger.create({
                            trigger: '.about__hero-main-img',
                            start: `top-=${document.querySelector('.about__hero-main-img').getBoundingClientRect().top + 1}px top`,
                            end: 'bottom bottom-=25%',
                            onLeave: () => {
                                console.log("leave")
                                let mainImgTl = gsap.timeline({
                                        scrollTrigger: {
                                            trigger: '.about__hero-main-img',
                                            start: `top+=10% bottom-=25%`,
                                            end: 'bottom bottom-=25%',
                                            scrub: true,
                                            markers: true
                                    }
                                })

                                mainImgTl
                                    .fromTo('.about__hero-main-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 })
                                    .fromTo('.about__hero-main-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1, ease: 'power1.out', duration: 1.2  }, "<=0")

                                // let subImgTl = gsap.timeline({
                                //         scrollTrigger: {
                                //             trigger: '.about__hero-sub-img',
                                //             start: `top+=10% bottom-=25%`,
                                //             end: 'bottom bottom-=25%',
                                //             scrub: true,
                                //             markers: true
                                //     }
                                // })

                                // subImgTl
                                //     .fromTo('.about__hero-sub-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 2 })
                                //     .fromTo('.about__hero-sub-img img', { xPercent: -25, yPercent: -25, scale: 1.4 }, { xPercent: 0, yPercent: 0, scale: 1 , duration: 2.4, ease: 'power1.out'}, "<=0")
                            },
                            once: true
                        })
                    }
                }
            });

            tlShow
                .to(title.words, {
                    autoAlpha: 1, yPercent: 0, duration: .8, stagger: .04,
                    onComplete: () => {
                        title.revert();
                        document.querySelectorAll('.about__hero-title-txt span').forEach(el => el.removeAttribute('style'));
                    }
                }, "<=0")
                .to('.about__hero-title-txt .copyright', {
                    autoAlpha: 1, yPercent: 0, duration: .8, clearProps: 'all'}, "<=0")
                .to(year.words, {
                    autoAlpha: 1, yPercent: 0, duration: 1, stagger: .04, clearProps: 'all'}, "<=0")
                .to('.about__hero-main-img', { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.5, clearProps: 'all' }, "<=0")
                .to('.about__hero-main-img img ', { xPercent: 0, yPercent: 0, scale: 1, ease: 'power1.out', duration: 1.7, clearProps: 'all' }, "<=0")
                .to(intro.words, {
                    autoAlpha: 1, yPercent: 0, duration: 1, stagger: .04, onComplete: () => { intro.revert(); document.querySelector('.about__hero-main-intro').removeAttribute('style') }}, "<=0")
                .to('.about__hero-main-intro .line', { scaleX: 1, duration: 1, clearProps: 'all' }, "<=.2")
        }

        if (document.querySelector('.loader-wrap').classList.contains('on-done')) {
            fadeContent(.4);
        }
        else {
            document.addEventListener('loaderComplete', fadeContent);
        }

        if (window.innerWidth <= 767) {
            gsap.set('.about__hero-sub-img', { top: (window.innerHeight - document.querySelector('.about__hero-sub-img').offsetHeight) / 2 })
        }
        onCleanup(() => {
            tl?.kill();
            document.removeEventListener('loaderComplete', fadeContent);
        })
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;