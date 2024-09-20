import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initLenis, reInitLenisScroll } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { InterOption, ScrollOption } from '~/utils/helper';
import { cvUnit } from '~/utils/number';

const FooterScript = () => {
  let scriptRef;

  let allSplitText = [];
  const elements = [
    { selector: '.home__hero-clone-scope li' },
    { selector: '.home__hero-clone-greating' },
    { selector: '.home__hero-clone-name' },
    { selector: '.home__hero-clone-scrolldown' },
    { selector: '.home__hero-clone-title-txt', options: { stagger: 0.04 } },
    { selector: '.home__hero-clone-intro' },
  ];

  onMount(() => {
    if (!scriptRef) return;

    initScrollTrigger();

    const splitedTitle = SplitType.create('.footer__title', {
      types: 'lines, words',
      lineClass: 'split-line-blur',
    });
    const footerItems = splitTextFadeUp('.footer__link');
    const footerLabels = splitTextFadeUp('.footer__label');
    const footerTextBody = splitTextFadeUp('.footer__cta-title');
    const footerTextLabel = splitTextFadeUp('.footer__cta-label');
    const lineFooter = document.querySelector('.footer__cta .line');
    gsap.set(lineFooter, { scaleX: 0, transformOrigin: 'left' });
    let offSetStart = document.querySelector('.footer .container').offsetTop;
    let triggerHeight = document.querySelector('.footer__title').offsetHeight;
    let offsetEnd = offSetStart + triggerHeight;
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.home-footer-hero',
        start: `top+=${offSetStart + triggerHeight / 2}px bottom`,
        end: `top+=${offsetEnd + triggerHeight / 2}px bottom`,
        scrub: true,
      },
    });
    tl.fromTo(
      splitedTitle.words,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 5.5, stagger: 0.4, ease: 'linear' }
    );

    let tlInfiniteImg, tlInfiniteText;
    let isInitInfinite = window.innerWidth > 991 ? false : true;

    AnimationFooter();
    function AnimationFooter() {
      const playLabel = () => {
        gsap.to(footerLabels.words, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            footerLabels.revert();
          },
        });
      };
      const playLinks = () => {
        gsap.to(footerItems.words, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            footerItems.revert();
          },
        });
      };
      InterOption(document.querySelector('.footer__info-item'), playLabel);
      InterOption(document.querySelector('.footer__info-item'), playLinks);

      gsap.to(footerTextBody.words, {
        yPercent: 0,
        duration: 1,
        autoAlpha: 1,
        delay: 0.15,
        ease: 'power2.inOut',
        ...ScrollOption('.footer__cta-title'),
      });
      gsap.to(footerTextLabel.words, {
        yPercent: 0,
        duration: 1,
        autoAlpha: 1,
        stagger: 0.1,
        ease: 'power2.inOut',
        ...ScrollOption('.footer__cta-label'),
      });
      gsap.to(lineFooter, {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 1,
        ease: 'power2.inOut',
        ...ScrollOption(lineFooter),
      });
    }

    function AnimationsInfinite() {
      tlInfiniteImg = gsap.timeline({
        data: 'footer-timeline',
        scrollTrigger: {
          trigger: '.home-footer-hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onEnter() {
            if (!isInitInfinite) {
              isInitInfinite = true;
              let lenis = initLenis({ infinite: true });
              reInitLenisScroll(lenis, false);
            }
          },
          onToggle(self) {
            if (self.isActive) {
              document.querySelector('.home-hero-intro-wrap').classList.add('force-hero');
            } else {
              document.querySelector('.home-hero-intro-wrap').classList.remove('force-hero');
            }
          },
        },
      });

      tlInfiniteImg
        .to('.footer__bg', {
          scaleY: 5,
          scaleX: 2.5,
          skewX: '-30deg',
          duration: 1,
          ease: 'power2.in',
        })
        .to(
          '.footer__link',
          { autoAlpha: 0, duration: 0.4, stagger: 0.01, ease: 'power2.in' },
          '<0.15'
        )
        .to(
          '.footer__label',
          { autoAlpha: 0, duration: 0.5, stagger: 0.01, ease: 'power2.in' },
          '<0.15'
        )
        .to('.footer__main-image-img.ver-dark', { autoAlpha: 1, duration: 1, ease: 'linear' }, '<0')
        // .to('.footer__main-image-img.ver-light', {autoAlpha: 0, duration: 1, ease: 'linear' }, "<0")
        .to('.footer__cta .line', { autoAlpha: 0, duration: 0.3 }, '<0')
        .to('.footer__cta', { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '<0.15')
        .to('.footer__title', { autoAlpha: 0, duration: 0.5 }, '<0.35')
        .fromTo(
          '.footer__marquee-wrap',
          { autoAlpha: 1, filter: 'brightness(1)', yPercent: 0 },
          { autoAlpha: 0, filter: 'brightness(.1)', duration: 0.4, ease: 'power2.inOut' },
          '<0'
        )
        .to(
          '.footer',
          { background: 'rgba(255, 255, 255, 0)', duration: 0, pointerEvents: 'none' },
          '<0.15'
        )
        .to('.footer__bg', { autoAlpha: 0, duration: 0.3, ease: 'linear' }, '<0.1')
        .to(
          '.footer__main-image',
          { scale: 3.5, xPercent: 50, duration: 4, transformOrigin: 'left 40%' },
          '>.1'
        )
        .from(
          '.home__hero-clone-bg-main',
          {
            filter: 'blur(10px)',
            autoAlpha: 0.4,
            rotationY: -18,
            rotationX: 25,
            rotationZ: -2,
            scale: 0.5,
            duration: 4,
            transformOrigin: '20% 88%',
          },
          '<0'
        )
        .fromTo(
          '.footer__main-image',
          { filter: 'blur(0) brightness(1)' },
          { filter: 'blur(3px) brightness(.3)', duration: 1.5 },
          '<2.5'
        )
        .to('.footer__main-image', { autoAlpha: 0, duration: 0.8 }, '<1');

      elements.forEach((el) => {
        let subSplitText = [];

        let currSelector = document.querySelectorAll(el.selector);
        if (currSelector.length > 0) {
          currSelector.forEach((text, idx) => {
            let splittext = new SplitType(text, {
              types: 'lines, words',
              lineClass: 'split-line unset-margin',
            });
            gsap.set(splittext.words, { autoAlpha: 0 });
            subSplitText.push(splittext);
          });
        } else {
          let splittext = new SplitType(currSelector, {
            types: 'lines, words',
            lineClass: 'split-line unset-margin',
          });
          gsap.set(splittext.words, { autoAlpha: 0 });
          subSplitText.push(splittext);
        }

        allSplitText.push(subSplitText); // Push to the sub-array
      });

      tlInfiniteText = gsap.timeline({
        data: 'footer-timeline',
        scrollTrigger: {
          trigger: '.home-footer-hero',
          start: `bottom-=${cvUnit(200, 'vh')}px bottom`,
          end: 'bottom bottom',
          scrub: true,
        },
      });

      tlInfiniteText
        .to('.home__hero-clone-main', { autoAlpha: 1, duration: 1 })
        .fromTo(
          '.home__hero-clone-bg-under',
          { autoAlpha: 0, scale: 1.2 },
          { autoAlpha: 1, scale: 1, transformOrigin: 'center -10%', duration: 2 }
        );

      allSplitText.forEach((el) => {
        if (el.length > 0) {
          el.forEach((splitChild, idx) => {
            tlInfiniteText.fromTo(
              splitChild.words,
              { yPercent: 70, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1.5,
                stagger: 0.016,
                delay: idx * 0.1,
                ease: 'power2.inOut',
                ...el.options,
              },
              '<=0'
            );
          });
        } else {
          tlInfiniteText.fromTo(
            el.words,
            { yPercent: 70, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              stagger: 0.016,
              duration: 1.5,
              ease: 'power2.inOut',
              ...el.options,
            },
            '<=0'
          );
        }
      });

      tlInfiniteText
        .fromTo(
          '.home__hero-clone-title-slide-inner',
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' },
          '<0'
        )
        .fromTo(
          '.home__hero-clone-scope-cta',
          { yPercent: 70, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
              // gsap.set('.home__hero-clone-wrap', { zIndex: 3, duration: 0 })
            },
          },
          '<0'
        )
        .fromTo(
          '.home__hero-clone-award',
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 1, stagger: 0.1 },
          '<0'
        )
        .from(
          '.home__hero-clone .line',
          { scaleX: 0, transformOrigin: 'left', duration: 0.8, stagger: 0.1 },
          '<0.1'
        )
        .to('.home__hero-clone-main', { duration: 0.5 });
    }

    if (window.innerWidth > 991) {
      AnimationsInfinite();
    }

    onCleanup(() => {
      tl.kill();
      tlInfiniteImg.kill();
      tlInfiniteText.kill();
    });
  });

  return <div ref={scriptRef} class="divScript"></div>;
};

export default FooterScript;
