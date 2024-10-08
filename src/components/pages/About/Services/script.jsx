import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { registeredEvents } from '~/components/core/swup';
import { splitTextFadeUp } from '~/utils/gsap';
import { ScrollOption } from '~/utils/helper';

const ServicesScript = () => {
  let scriptRef;

  onMount(() => {
    if (!scriptRef) return;
    initScrollTrigger();

    const textServiceLabel = splitTextFadeUp('.about__service-title-label');
    const titleServicesAbout = splitTextFadeUp('.about__service-title-sb');
    const lines = document.querySelectorAll('.about__service .line');
    const contentAboutDaily = document.querySelector('.about__daily-content');
    const listNumberServices = document.querySelectorAll('.about__service-item-order');
    const listTitleServices = document.querySelectorAll('.about__service-item-title');
    const btnToggles = document.querySelectorAll('.about__service-item-toggle');

    gsap.set('.about__service-title-slide-inner', { autoAlpha: 0, yPercent: 70 });
    gsap.set(lines, { scaleX: 0, transformOrigin: 'left', duration: 0 });
    gsap.set(listTitleServices, { y: '100%', opacity: 0 });
    gsap.set(listNumberServices, { y: '100%', opacity: 0 });
    gsap.set(btnToggles, { opacity: 0 });
    const textContentSplide = splitTextFadeUp(contentAboutDaily);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.about__daily',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    tl.fromTo(
      '.about__daily-img-inner img',
      { y: '-20%' },
      { y: '5%', duration: 1, ease: 'linear' }
    );
    gsap.to(textServiceLabel.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.8,
      stagger: 0.02,
      ...ScrollOption('.about__service-title-label'),
    });

    gsap.to([titleServicesAbout.words, '.about__service-title-slide-inner'], {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1,
      onComplete: () => {
        titleServicesAbout.revert();
        document
          .querySelectorAll('.about__service-title-sb')
          .forEach((el) => el.removeAttribute('style'));
        document.querySelector('.about__service-title-slide-inner').removeAttribute('style');
        document.querySelector('.about__service-title-slide-inner .slide-txt-wrap').click();
      },
      ...ScrollOption('.about__service-title'),
    });
    gsap.to(textContentSplide.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.02,
      ease: 'power2.inOut',
      ...ScrollOption(contentAboutDaily),
    });

    lines.forEach((line) =>
      gsap.to(line, {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 1.2,
        ...ScrollOption('.about__service-listing'),
      })
    );
    listNumberServices.forEach((number) => {
      gsap.to(number, {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        duration: 1.2,
        stagger: 0.05,
        ...ScrollOption('.about__service-listing'),
      });
    });
    listTitleServices.forEach((title) => {
      gsap.to(title, {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        duration: 1.2,
        stagger: 0.05,
        ...ScrollOption('.about__service-listing'),
      });
    });
    btnToggles.forEach((btn) => {
      gsap.to(btn, {
        opacity: 1,
        ease: 'power3',
        duration: 1.2,
        delay: 0.1,
        ...ScrollOption(btn),
      });
    });
    const serviceItems = document.querySelectorAll('.about__service-item');
    const handleToggle = (e) => {
      const el = e.currentTarget;
      const content = el.querySelector('.about__service-item-desc');

      requestAnimationFrame(() => {
        if (el.classList.contains('active')) {
          gsap.to(content, {
            height: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onStart() {
              el.classList.remove('active');
            },
          });
        } else {
          gsap
            .timeline()
            .to('.about__service-item.active .about__service-item-desc', {
              height: 0,
              duration: 0.5,
              ease: 'power2.inOut',
              onStart() {
                document.querySelectorAll('.about__service-item.active').forEach((item) => {
                  item.classList.remove('active');
                });
                el.classList.add('active');
              },
            })
            .to(
              content,
              {
                height: content.scrollHeight,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              '<=.1'
            );
        }
      });
    };

    if (window.innerWidth <= 991) {
      serviceItems.forEach((el) => {
        el.addEventListener('click', handleToggle);
        registeredEvents.push({ type: 'click', handler: handleToggle, element: el });
      });
    }
    onCleanup(() => {
      tl.kill();
      serviceItems.forEach((el) => {
        el.removeEventListener('click', handleToggle);
      });
    });
  });

  return <div ref={scriptRef} class="divScript"></div>;
};
export default ServicesScript;
