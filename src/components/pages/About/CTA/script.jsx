import { onCleanup, onMount } from 'solid-js';
import gsap from 'gsap';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollOption } from '~/utils/helper';

const CTAScript = () => {
  let scriptRef;

  onMount(() => {
    if (!scriptRef) return;

    initScrollTrigger();

    const listContactItem = document.querySelectorAll('.about__cta-body-contact-item');
    const labelAbout = splitTextFadeUp('.about__cta-head-label');
    const textContentCTA = splitTextFadeUp('.about__cta-head-content-txt span');
    const textCTABody = splitTextFadeUp('.about__cta-body-label');
    const textSub = splitTextFadeUp('.about__cta-body-label_sb');
    const textMail = splitTextFadeUp('.about__cta-body-email-inner');
    const textMailMb = splitTextFadeUp('.about__cta-body-email.mod-mb');

    gsap.set('.about__cta-head-content-txt-inner', { yPercent: 70, autoAlpha: 0 });

    gsap.to(labelAbout.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        labelAbout.revert();
      },
      ...ScrollOption('.about__cta-head-label'),
    });

    gsap.to([...textContentCTA.words, '.about__cta-head-content-txt-inner'], {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.15,
      // delay: (index ) => {
      //     return 0.2 * index
      // }  ,
      ...ScrollOption('.about__cta-head-content-txt'),
      onComplete: () => {
        textContentCTA.revert();
      },
    });
    gsap.to('.about__cta-head-content-txt-inner', {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.15,
      delay: 0.15,
      ...ScrollOption('.about__cta-head-content-txt'),
      onComplete: () => {
        document
          .querySelectorAll('.about__cta-head-content-txt-inner .slide-txt-wrap')
          .forEach((item, index) => {
            setTimeout(() => {
              item.click();
            }, index * 400);
          });
      },
    });
    gsap.to(textSub.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        textSub.revert();
      },
      ...ScrollOption('.about__cta-body-label_sb'),
    });
    gsap.to(textCTABody.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        textCTABody.revert();
      },
      ...ScrollOption('.about__cta-body-label'),
    });
    gsap.to(textMail.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        textMail.revert();
      },
      ...ScrollOption('.about__cta-body-email-inner'),
    });
    gsap.to(textMailMb.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        textMailMb.revert();
      },
      ...ScrollOption('.about__cta-body-email.mod-mb', {
        start: 'top bottom-=10%'
      }),
    });
    listContactItem.forEach((contact) => {
      const labelSpliting = splitTextFadeUp(contact.querySelectorAll('.about__cta-body-label'));
      const listSocials = splitTextFadeUp(contact.querySelectorAll('.txt-link'));

      gsap.to([...labelSpliting.words, ...listSocials.words], {
        autoAlpha: 1,
        yPercent: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          labelSpliting.revert();
          listSocials.revert();
        },
        ...ScrollOption(contact),
      });
    });
  });
  return <div ref={scriptRef} class="divScript"></div>;
};

export default CTAScript;
