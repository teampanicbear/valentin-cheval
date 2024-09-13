import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
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
            .fromTo('.home__hero-bg-main-inner-bg', { scale: 1}, { scale: .6, duration: 2, ease: 'linear' }, 0)
            .fromTo('.home__hero-title-wrap, .home__hero-scope-wrap, .home__hero-intro-wrap', { autoAlpha: 1 }, { autoAlpha: 1, stagger: .1, duration: .5, ease: 'linear' }, 0)
            .fromTo('.home__hero-bg-main-wrap', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'linear' }, '>.5')
            .fromTo('.home__intro-companies', { yPercent: 0 }, { yPercent: window.innerWidth > 767 ? 20 : 0, duration: 1, ease: 'linear' }, "<.3")
            .to('.home__intro-bg-gradient', { display: 'none', duration: 0, ease: 'linear' })

        let title = splitTextFadeUp('.home__hero-title-txt');
        let desc = splitTextFadeUp('.home__hero-intro');
        let scopes = splitTextFadeUp('.home__hero-scope li');
        let greatingTitle = splitTextFadeUp('.home__hero-greating');
        let greatingName = splitTextFadeUp('.home__hero-name');
        let scrollDown = splitTextFadeUp('.home__hero-scrolldown');

        gsap.set('.home__hero-title-slide-inner', { autoAlpha: 0, yPercent: 70 });
        gsap.set('.home__hero-scope-cta', { autoAlpha: 0, yPercent: 70, duration: 0 });
        gsap.set('.home__hero-award', { autoAlpha: 0, scale: .8, yPercent: 20, duration: 0 });
        gsap.set('.home__hero .line', { scaleX: 0, transformOrigin: 'left', duration: 0 });
        gsap.set('.home__hero-bg', { autoAlpha: 0, duration: 0 });

        let tlShow;
        const fadeContent = (delay) => {
            tlShow = gsap
                .timeline({ delay: delay || 0, defaults: { ease: 'power2.out' } })
                .to('.home__hero-bg', { autoAlpha: 1, duration: 1, clearProps: 'all' })
                .to('.home__hero .line', { scaleX: 1, duration: .8, stagger: .2, clearProps: 'all' })
                .to(scopes.words, {
                    autoAlpha: 1, yPercent: 0, duration: 1, stagger: .02,
                    onComplete: () => {
                        scopes.revert();
                        document.querySelectorAll('.home__hero-scope li').forEach(el => el.removeAttribute('style'))
                    }
                }, "<0.1")
                .to([title.words, '.home__hero-title-slide-inner'], {
                    autoAlpha: 1, yPercent: 0, duration: 1,
                    onComplete: () => {
                        title.revert();
                        document.querySelectorAll('.home__hero-title-txt').forEach(el => el.removeAttribute('style'));
                        document.querySelector('.home__hero-title-slide-inner').removeAttribute('style');
                        document.querySelector('.home__hero-title-slide .slide-txt-wrap').click();
                        document.querySelector('.home__hero-clone-title-slide-inner .slide-txt-wrap').click();
                    }
                }, "<=0")
                .to(desc.words, {
                    autoAlpha: 1, yPercent: 0, duration: .8, stagger: .02,
                    onComplete: () => { document.querySelector('.home__hero-intro').removeAttribute('style'); desc.revert(); },
                }, "<=0")
                .to('.home__hero-scope-cta', {
                    autoAlpha: 1, yPercent: 0, duration: .8,
                    onComplete: () => { document.querySelector('.home__hero-scope-cta').removeAttribute('style'); }
                }, "<=0")
                .to(greatingTitle.words, {
                    autoAlpha: 1, yPercent: 0, duration: .8, stagger: .02,
                    onComplete: () => { document.querySelector('.home__hero-greating').removeAttribute('style'); greatingTitle.revert(); }
                }, "<=0")
                .to(greatingName.words, {
                    autoAlpha: 1, yPercent: 0, duration: .8, stagger: .02,
                    onComplete: () => { document.querySelector('.home__hero-name').removeAttribute('style'); greatingName.revert(); }
                }, "<=0")
                .to(scrollDown.words, {
                    autoAlpha: 1, yPercent: 0, duration: .8, stagger: .02,
                    onComplete: () => { document.querySelector('.home__hero-scrolldown').removeAttribute('style'); scrollDown.revert(); }
                }, "<=0")
                .to('.home__hero-award', { autoAlpha: 1, scale: 1, yPercent: 0, duration: 1.2, stagger: .1, clearProps: 'all' }, "<=0")
        }
        if (document.querySelector('.loader-wrap').classList.contains('on-done')) {
            fadeContent(.4);
        }
        else {
            document.addEventListener('loaderComplete', fadeContent);
        }
        onCleanup(() => {
            tl.kill();
            tlShow.kill();
            document.removeEventListener('loaderComplete', fadeContent);
        });
    })
    return <div ref={scriptRef} class="divScript"></div>
}

export default HeroScript;