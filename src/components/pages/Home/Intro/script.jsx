import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getCursor } from '~/components/core/cursor';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { gGetter, gSetter, splitTextFadeUp } from '~/utils/gsap';
import { inView, lerp } from '~/utils/number';

const IntroScript = () => {
  let scriptRef;

  onMount(() => {
    if (!scriptRef) return;

    initScrollTrigger();

    // gsap.set('.home__intro-bg-gradient', { height: document.querySelector('.home__intro-main').offsetHeight })

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.home__intro-awards-listing',
        start: 'top bottom',
        end: 'bottom bottom',
        endTrigger: `${window.innerWidth > 767 ? '.home__intro-awards-listing' : '.home__intro-service-wrap'}`,
        scrub: true,
      },
    });

    tl.to('.home__intro-award', { '--scale-factor': '1', duration: 1, stagger: 0.03 });

    let imgScrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.home__intro-portrait',
        start: 'top top+=75%',
        end: 'bottom top+=75%',
        scrub: true,
      },
    });
    imgScrubTl
      .fromTo(
        '.home__intro-portrait',
        { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1 }
      )
      .fromTo(
        '.home__intro-portrait img',
        { xPercent: -25, yPercent: -25, scale: 1.4 },
        { xPercent: 0, yPercent: 0, scale: 1, ease: 'power1.out', duration: 1.2 },
        '<=0'
      );

    let reqID;
    const xGetter = gGetter('x');
    const yGetter = gGetter('y');
    const xSetter = gSetter('x', 'px');
    const ySetter = gSetter('y', 'px');

    let target = document.querySelectorAll('.home__intro-award-logo');
    let wrap = document.querySelector('.home__intro-awards-wrap');

    const logoMove = () => {
      if (
        inView(document.querySelector('.home__intro-service-blur')) &&
        window.innerWidth > 991 &&
        document.querySelectorAll('[data-namespace="home"]').length >= 1
      ) {
        let xMove = xGetter(document.querySelector('.home__intro-service-blur-inner'));
        let yMove = yGetter(document.querySelector('.home__intro-service-blur-inner'));
        xSetter(document.querySelector('.home__intro-service-blur-inner'))(
          lerp(
            xMove,
            getCursor().xNorCenter *
              document.querySelector('.home__intro-service-blur-inner').getBoundingClientRect()
                .width *
              0.2,
            0.04
          )
        );
        ySetter(document.querySelector('.home__intro-service-blur-inner'))(
          lerp(
            yMove,
            getCursor().yNorCenter *
              document.querySelector('.home__intro-service-blur-inner').getBoundingClientRect()
                .height *
              0.12,
            0.04
          )
        );
      }
      if (inView(wrap) && window.innerWidth > 991) {
        target.forEach((el) => {
          let yMove;
          if (document.querySelectorAll('.home__intro-awards:hover').length) {
            yMove =
              getCursor().y -
              wrap.getBoundingClientRect().top -
              el.getBoundingClientRect().height / 2;
          } else {
            yMove = yGetter(target[0]);
          }
          ySetter(el)(lerp(yGetter(target[0]), yMove, 0.1));
        });
      }
      reqID = requestAnimationFrame(logoMove);
    };
    if (reqID == undefined) {
      reqID = requestAnimationFrame(logoMove);
    }

    const fadeContent = () => {
      let introCompTitle = splitTextFadeUp('.home__intro-companies-title');

      gsap.set('.home__intro-main-txt', { autoAlpha: 0, y: 30, duration: 0 });
      gsap.to(
        '.home__intro-main-txt',
        {
          scrollTrigger: {
            trigger: '.home__intro',
            start: 'top bottom-=25%',
          },
          autoAlpha: 1,
          y: 0,
          duration: 1,
          clearProps: 'all',
        },
        '<=0'
      );

      gsap.to(introCompTitle.words, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.6,
        stagger: 0.04,
        onComplete: () => {
          introCompTitle.revert();
          document.querySelector('.home__intro-companies-title').removeAttribute('style');
        },
        scrollTrigger: {
          trigger: '.home__intro-companies-title',
          start: 'top bottom-=25%',
        },
      });

      let tlCompany = gsap.timeline({
        scrollTrigger: {
          trigger: '.home__intro-companies-listing',
          start: 'top bottom-=30%',
        },
      });
      document.querySelectorAll('.home__intro-company').forEach((el, idx) => {
        gsap.set(el, { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' });
        gsap.set(el.querySelector('.ic'), { xPercent: -25, yPercent: -25, scale: 1.4 });
        tlCompany
          .to(
            el,
            {
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 0.5,
              clearProps: 'all',
              delay: idx * 0.05,
            },
            '<=0'
          )
          .to(
            el.querySelector('.ic'),
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
      });

      gsap.from('.home__intro-btn', {
        autoAlpha: 0,
        scale: 1.1,
        duration: 0.5,
        scrollTrigger: {
          trigger: '.home__intro-btn',
          start: 'top bottom-=25%',
        },
      });

      let awardTitle = splitTextFadeUp('.home__intro-awards-title');
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.home__intro-awards-title',
            start: 'top bottom-=25%',
          },
        })
        .to(awardTitle.words, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.6,
          onComplete: () => {
            awardTitle.revert();
            document.querySelector('.home__intro-awards-title').removeAttribute('style');
          },
        })
        .from(
          '.home__intro-awards-wrap',
          { autoAlpha: 0, y: 20, duration: 0.8, clearProps: 'all' },
          '<=.2'
        );
    };

    fadeContent();

    onCleanup(() => {
      cancelAnimationFrame(reqID);
      tl.kill();
      imgScrubTl.kill();
    });
  });

  return <div ref={scriptRef} class="divScript"></div>;
};
export default IntroScript;
