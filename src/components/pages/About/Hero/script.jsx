import { onCleanup, onMount } from 'solid-js';
import gsap from 'gsap';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollOption } from '~/utils/helper';

const HeroScript = () => {
  let scriptRef;

  onMount(() => {
    if (!scriptRef) return;

    initScrollTrigger();
    let tl;
    let tlShow;

    gsap.set('.about__hero-main-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' });
    gsap.set('.about__hero-main-img img', { xPercent: -10, yPercent: -10, scale: 1.4 });
    gsap.set('.about__hero-sub-img', { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' });
    gsap.set('.about__hero-sub-img img', { xPercent: -25, yPercent: -25, scale: 1.4 });
    gsap.set('.about__hero-title-txt .copyright', { autoAlpha: 0, yPercent: 100, duration: 0 });
    gsap.set('.about__hero-main-intro .line', { scaleX: 0, transformOrigin: 'left', duration: 0 });

    let title = splitTextFadeUp('.about__hero-title-txt span');
    let year = splitTextFadeUp('.about__hero-title-year');
    let intro = splitTextFadeUp('.about__hero-main-intro .heading');

    const fadeContent = (delay) => {
      tlShow = gsap.timeline({
        defaults: { ease: 'power2.out' },
        delay: typeof delay !== 'object' && typeof delay === 'number' ? delay : 0.8,
        onStart() {
          if (window.innerWidth > 991) {
            ScrollTrigger.create({
              trigger: '.about__hero-main-img',
              start: `top-=${document.querySelector('.about__hero-main-img').getBoundingClientRect().top + 1}px bottom-=25%`,
              end: 'bottom bottom-=25%',
              once: true,
              onLeave: () => {
                let mainImgTl = gsap.timeline({
                  scrollTrigger: {
                    trigger: '.about__hero-main-img',
                    start: `top+=10% bottom-=25%`,
                    end: 'bottom bottom-=25%',
                    scrub: true,
                  },
                });

                mainImgTl
                  .fromTo(
                    '.about__hero-main-img',
                    { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' },
                    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }
                  )
                  .fromTo(
                    '.about__hero-main-img img',
                    { xPercent: -25, yPercent: -25, scale: 1.4 },
                    { xPercent: 0, yPercent: 0, scale: 1, ease: 'power1.out', duration: 1.2 },
                    '<=0'
                  );

                let subImgTl = gsap.timeline({
                  scrollTrigger: {
                    trigger: '.about__hero-sub-img',
                    start: `top bottom-=25%`,
                    end: 'bottom bottom-=25%',
                    scrub: true,
                  },
                });

                subImgTl
                  .fromTo(
                    '.about__hero-sub-img',
                    { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' },
                    { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }
                  )
                  .fromTo(
                    '.about__hero-sub-img img',
                    { xPercent: -25, yPercent: -25, scale: 1.4 },
                    { xPercent: 0, yPercent: 0, scale: 1, duration: 1.2, ease: 'power1.out' },
                    '<=0'
                  );
              },
            });
          }
        },
      });

      tlShow
        .to(
          title.words,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: 0.04,
            onComplete: () => {
              title.revert();
              document
                .querySelectorAll('.about__hero-title-txt span')
                .forEach((el) => el.removeAttribute('style'));
            },
          },
          '<=0'
        )
        .to(
          '.about__hero-title-txt .copyright',
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            clearProps: 'all',
          },
          '<=0'
        )
        .to(
          year.words,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            stagger: 0.04,
            clearProps: 'all',
          },
          '<=0'
        )
        .to(
          intro.words,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            stagger: 0.04,
            onComplete: () => {
              intro.revert();
              document.querySelector('.about__hero-main-intro').removeAttribute('style');
            },
          },
          '<=0'
        )
        .to('.about__hero-main-intro .line', { scaleX: 1, duration: 1, clearProps: 'all' }, '<=.2')
        .to(
          '.about__hero-main-img',
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1, clearProps: 'all' },
          '<=0'
        )
        .to(
          '.about__hero-main-img img ',
          {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            ease: 'power1.out',
            duration: 1,
            clearProps: 'all',
          },
          '<=0'
        );
      if (window.innerWidth > 767 && window.innerWidth <= 991) {
        tlShow
          .to(
            '.about__hero-sub-img',
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 0.5,
              clearProps: 'all',
            },
            '<=.5'
          )
          .to(
            '.about__hero-sub-img img ',
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              ease: 'power1.out',
              duration: 0.7,
              clearProps: 'all',
            },
            '<=0'
          );
      }
    };

    if (document.querySelector('.loader-wrap').classList.contains('on-done')) {
      fadeContent(0.4);
    } else {
      (async () => {
        await window.loaderCompletePromise;
        fadeContent();
      })();
    }

    if (window.innerWidth <= 767) {
      gsap.set('.about__hero-sub-img', {
        top: (window.innerHeight - document.querySelector('.about__hero-sub-img').offsetHeight) / 2,
      });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.about__hero-sub-img',
            start: `top bottom-=25%`,
          },
        })
        .fromTo(
          '.about__hero-sub-img',
          { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' },
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }
        )
        .fromTo(
          '.about__hero-sub-img img',
          { xPercent: -25, yPercent: -25, scale: 1.4 },
          { xPercent: 0, yPercent: 0, scale: 1, duration: 1.2, ease: 'power1.out' },
          '<=0'
        );
    }

    let sub1 = splitTextFadeUp('.about__hero-sub-intro.intro-1');
    let sub2 = splitTextFadeUp('.about__hero-sub-intro.intro-2');

    gsap.to(sub1.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: 0.02,
      ...ScrollOption('.about__hero-sub-intro.intro-1'),
      onComplete: () => {
        sub1.revert();
        document.querySelector('.about__hero-sub-intro.intro-1').removeAttribute('style');
      },
    });
    gsap.to(
      sub2.words,
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.8,
        stagger: 0.02,
        ...ScrollOption('.about__hero-sub-intro.intro-2'),
        onComplete: () => {
          sub2.revert();
          document.querySelector('.about__hero-sub-intro.intro-1').removeAttribute('style');
        },
      },
      '<=0'
    );

    onCleanup(() => {
      tl?.kill();
      document.removeEventListener('loaderComplete', fadeContent);
    });
  });
  return <div ref={scriptRef} class="divScript"></div>;
};

export default HeroScript;
