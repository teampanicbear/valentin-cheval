import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { getLenis } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { registeredEvents } from '~/components/core/swup';
import { circ, sine } from '~/utils/easing';
import { cvUnit } from '~/utils/number';

const LoaderScript = () => {
  let scriptRef;

  const animationShowHome = (timeline) => {
    gsap.set('.home__hero-loader', { autoAlpha: 1 });
    if (window.innerWidth > 991) {
      gsap.set('.home__hero-loader-hero-inner', {
        filter: 'blur(10px) brightness(.5)',
        autoAlpha: 1,
        rotationY: -12,
        rotationX: 15,
        rotationZ: -2,
        scale: 0.5,
        transformOrigin: 'center center',
      });
      gsap.set('.home__hero-loader-bg', { autoAlpha: 0, scale: 1.25, filter: 'brightness(4)' });

      timeline
        .to(
          '.home__hero-loader-hero-inner',
          {
            filter: 'blur(0px) brightness(1)',
            autoAlpha: 1,
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            scale: 1,
            duration: 2,
          },
          '<=0'
        )
        // .to('.home__hero-loader-bg', { autoAlpha: 1, filter: 'brightness(1)', scale: 1, duration: 1.5, ease: gsap.parseEase(circ.inOut) }, "<=1")
        .to(
          '.home__hero-loader',
          {
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              document.querySelector('.home__hero-loader').remove();
              document.querySelector('.loader-wrap').classList.add('on-done');
              getLenis().start();
            },
          },
          '-=.2'
        );
    } else {
      gsap.set('.home__hero-loader-hero-inner', {
        filter: 'blur(5px) brightness(.5)',
        scale: 0.75,
        rotationY: -2,
        rotationX: 20,
        rotationZ: -2,
        transformOrigin: '60% center',
      });
      timeline
        .to(
          '.home__hero-loader-hero-inner',
          {
            filter: 'blur(0px) brightness(1)',
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            scale: 1,
            duration: 2,
            ease: gsap.parseEase(circ.out),
          },
          '<=0'
        )
        .to(
          '.home__hero-loader',
          {
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              document.querySelector('.home__hero-loader').remove();
              getLenis().start();
            },
          },
          '-=.2'
        );
    }
  };

  onMount(() => {
    if (!scriptRef) return;

    let isLoaded = sessionStorage.getItem('isLoaded') == 'true' ? true : false;
    initScrollTrigger();

    getLenis().stop();
    let hypot, angle;
    function updateOnResize() {
      hypot = Math.hypot(window.innerWidth, window.innerHeight);
      angle = (Math.atan2(window.innerHeight, window.innerWidth) * 180) / Math.PI;
      gsap.set('.loader-wrap', { '--hypot': `${hypot}px`, '--angle': `${angle}deg` });
    }
    window.addEventListener('resize', updateOnResize);
    registeredEvents.push({ type: 'resize', handler: updateOnResize, element: window });
    updateOnResize();
    document.querySelector('.loader-wrap').classList.add('on-ready');
    let tlLoad = gsap.timeline({
      paused: true,
      onComplete: () => {
        sessionStorage.getItem('isLoaded') == 'true'
          ? null
          : sessionStorage.setItem('isLoaded', 'true');
        document.dispatchEvent(new CustomEvent('loaderComplete'));
      },
    });
    if (!isLoaded) {
      document.querySelector('.loader-text-greating').classList.add('on-ready');
      tlLoad.to('.loader-wrap', {
        '--prog': 1,
        duration: 2,
        onComplete: () => {
          document.querySelector('.loader-cross').classList.add('on-done');
        },
      });
      let tlLoadMaster = gsap.timeline({
        delay: 0.2,
      });
      tlLoadMaster
        .to(tlLoad, { progress: 0.12, duration: 1.2, ease: 'power2.inOut' })
        .to(tlLoad, { progress: 0.65, duration: 1, ease: 'power2.inOut' })
        .to(tlLoad, {
          progress: 1,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to('.loader-wrap', {
              '--offsetX': `${window.innerWidth / 2}px`,
              '--offsetY': `${window.innerHeight / 2}px`,
              duration: 1.6,
              ease: 'power2.inOut',
            });
          },
        });
      if (document.querySelectorAll('[data-namespace="home"]').length) {
        animationShowHome(tlLoadMaster);
      } else {
        setTimeout(() => {
          getLenis().start();
          document.querySelector('.loader-wrap').classList.add('on-done');
        }, 4600);
      }
    } else {
      document.querySelector('.loader-cross').classList.add('on-done');
      let tlLoadMaster = gsap.timeline();
      tlLoadMaster.to(tlLoad, {
        progress: 1,
        duration: 0.6,
        onComplete: () => {
          gsap.to('.loader-wrap', {
            '--offsetX': `${window.innerWidth / 2}px`,
            '--offsetY': `${window.innerHeight / 2}px`,
            duration: 1.3,
            ease: 'power2.inOut',
          });
        },
      });
      if (document.querySelectorAll('[data-namespace="home"]').length) {
        animationShowHome(tlLoadMaster);
      } else {
        setTimeout(() => {
          document.querySelector('.loader-wrap').classList.add('on-done');
          getLenis().start();
        }, 1600);
      }
    }

    window.loaderCompletePromise = new Promise((resolve) => {
      const resolveCompleted = (e) => {
        resolve('complete');
      };
      document.addEventListener('loaderComplete', resolveCompleted);
      registeredEvents.push({
        type: 'loaderComplete',
        handler: resolveCompleted,
        element: document,
      });
    });

    onCleanup(() => {});
  });

  return <div ref={scriptRef} class="divScript"></div>;
};

export default LoaderScript;
