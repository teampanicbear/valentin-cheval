import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { circ, sine } from '~/utils/easing';
import { cvUnit } from '~/utils/number';

const LoaderScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        let isLoaded = sessionStorage.getItem("isLoaded") == 'true' ? true : false;

        initScrollTrigger();

        let hypot, angle;
        function updateOnResize() {
            hypot = Math.hypot(window.innerWidth, window.innerHeight);
            angle = (Math.atan2(window.innerHeight, window.innerWidth) * 180) / Math.PI
            gsap.set('.loader-wrap', {'--hypot': `${hypot}px`, '--angle': `${angle}deg`});
        }
        window.addEventListener('resize', updateOnResize);
        updateOnResize();
        document.querySelector('.loader-wrap').classList.add('on-ready');
        let tlLoad = gsap.timeline({
            paused: true,
            onComplete: () => {
                sessionStorage.getItem("isLoaded") == 'true' ? null : sessionStorage.setItem("isLoaded", 'true')
            }
        })
        if (!isLoaded) {
            document.querySelector('.home__hero-greating-wrap').classList.add('on-ready');
            tlLoad
            .to('.loader-wrap', {
                    '--prog': 1,
                    duration: 2, onComplete: () => {
                document.querySelector('.loader-cross').classList.add('on-done');
            }})
            let tlLoadMaster = gsap.timeline({
                delay: .3
            });
            tlLoadMaster
                .to(tlLoad, { progress: .12, duration: 1.2, ease: "power2.inOut" })
                .to(tlLoad, { progress: .65, duration: 1, ease: "power2.inOut" })
                .to(tlLoad, {
                    progress: 1, duration: .6, ease: "power2.inOut", onComplete: () => {
                        gsap.to('.loader-wrap', { '--offset': `${hypot / 2}px`, duration: 3, ease: gsap.parseEase(circ.out) })
                    }
                })
            if (window.location.pathname === '/') {
                gsap.set('.home__hero-loader', { autoAlpha: 1, duration: 0 });
                if (window.innerWidth > 991) {
                    gsap.set('.home__hero-loader-hero-inner', { filter: 'blur(10px) brightness(.5)', autoAlpha: 1, rotationY: -12, rotationX: 15, rotationZ: -2, scale: .5, transformOrigin: '20% 88%', duration: 0 });
                    gsap.set('.home__hero-loader-footer', { xPercent: 10, scale: 1.5, filter: 'blur(0) brightness(1)', duration: 0, transformOrigin: 'left 35%'  });
                    gsap.set('.home__hero-loader-bg', { autoAlpha: 0, scale: 1.25, filter: 'brightness(4)' });

                    tlLoadMaster
                        .to('.home__hero-loader-footer', { xPercent: 50, scale: 3.4, filter: 'blur(18px) brightness(0.3)', duration: 1.5, ease: gsap.parseEase(circ.in) }, 2.2)
                        .to('.home__hero-loader-hero-inner', { filter: 'blur(0px) brightness(1)', autoAlpha: 1, rotationY: 0, rotationX: 0, rotationZ: 0, scale: 1, duration: 3.5, ease: gsap.parseEase(circ.inOut) }, 2)
                        .to('.home__hero-loader-bg', { autoAlpha: 1, scale: 1, filter: 'brightness(1)', ease: gsap.parseEase(circ.inOut), duration: 1.5 }, 3)
                        .to('.home__hero-loader-footer', { zIndex: -1, duration: 0 }, 3.8)
                        .to('.home__hero-loader', {
                            autoAlpha: 0, duration: 1, ease: 'power3.inOut',
                            onComplete: () => document.querySelector('.home__hero-loader').remove()
                        }, '-=.2')
                }
                else  {
                    gsap.set('.home__hero-loader-hero-inner', { filter: 'blur(5px) brightness(.5)', autoAlpha: 1, scale: 1.5, duration: 4, duration: 0 });
                    gsap.set('.home__hero-loader-footer', { autoAlpha: 0 });
                    gsap.set('.home__hero-loader-bg', { autoAlpha: 0, scale: 1.25, filter: 'brightness(4)' });
                    tlLoadMaster
                        .to('.home__hero-loader-hero-inner', { filter: 'blur(0px) brightness(1)', autoAlpha: 1, scale: 1, duration: 3, ease: gsap.parseEase(circ.inOut) }, 2)
                        .to('.home__hero-loader-bg', { autoAlpha: 1, scale: 1, filter: 'brightness(1)', ease: gsap.parseEase(circ.inOut), duration: 1.5 }, 2.8)
                        .to('.home__hero-loader', {
                            autoAlpha: 0, duration: 1, ease: 'power3.inOut',
                            onComplete: () => document.querySelector('.home__hero-loader').remove()
                        }, '-=.2')
                }
            }
        } else {
            document.querySelector('.loader-cross').classList.add('on-done');
            document.querySelector('.home__hero-loader').remove();
            tlLoad
            .to('.loader-wrap', {delay: .3, '--offset': `${hypot / 2}px`, duration: 2, ease: 'power2.inOut' })
            tlLoad.play();
        }

        onCleanup(() => {

        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default LoaderScript;