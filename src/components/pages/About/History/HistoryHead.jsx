import gsap from 'gsap';
import { onMount } from 'solid-js';
import SlideText from '~/components/common/SlideText';
import TextTransClip from '~/components/common/TextTransClip';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { ScrollOption } from '~/utils/helper';
import { cvUnit } from '~/utils/number';

const HistoryHead = (props) => {
  let scriptRef;
  const LINE_HEIGHT_HEADING = 160 * 0.835;
  const calcHeadingTop = (idx) => cvUnit(160 + LINE_HEIGHT_HEADING * idx, 'rem');
  const triggerOpts = (idx) => {
    return {
      trigger: '.sc-about__history',
      start: `top+=${calcHeadingTop(idx)} bottom`,
      end: `top+=${calcHeadingTop(idx + 1)} top+=${window.innerHeight / 2 + LINE_HEIGHT_HEADING}`,
    };
  };
  onMount(() => {
    if (!scriptRef) return;
    initScrollTrigger();

    const textHistory = splitTextFadeUp('.about__history-title-txt span');
    const textLabel = splitTextFadeUp('.about__history-label');
    gsap.set('.about__history-title-inner', { autoAlpha: 0, yPercent: 70 });

    gsap.to([textHistory.words, '.about__history-title-inner'], {
      autoAlpha: 1,
      yPercent: 0,
      duration: 1.2,
      stagger: 0.02,
      ease: 'power2.out',
      onComplete: () => {
        textHistory.revert();
        document.querySelector('.about__history-title-inner .slide-txt-wrap')?.click();
        document
          .querySelectorAll('.about__history-title-txt')
          .forEach((el) => el.removeAttribute('style'));
        document
          .querySelectorAll('.about__history-title-sb')
          .forEach((el) => el.removeAttribute('style'));
      },
      ...ScrollOption('.about__history-title'),
    });
    gsap.to(textLabel.words, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power2.out',
      ...ScrollOption('.about__history-label'),
    });
  });
  return (
    <>
      <h2 ref={scriptRef} class="upper fix-font about__history-title grid">
        <div class="heading h2 fw-bold about__history-title-txt">
          <span>I have</span>
        </div>
        <div class="heading h2 fw-bold cl-txt-orange about__history-title-txt">
          <span>{Number(props.currentYear) - 16} years</span>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt">
          <span>of Experience</span>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt inline-flex">
          <span>in</span>
          <div>&nbsp;</div>
          <div
            class="cl-txt-title inline-block
                 about__history-title-sb"
          >
            <div class="about__history-title-inner">
              <SlideText
                data={props.slideText}
                client:visible={{ rootMargin: '100% 0% 100% 0%' }}
              />
            </div>
          </div>
        </div>

        <div class="heading h2 fw-bold about__history-title-txt">
          <span>field</span>{' '}
        </div>
      </h2>
      <h2 class="upper fix-font about__history-title mod-mb grid">
        <div class="heading h2 fw-bold about__history-title-txt">
          <span>I have</span>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt">
          <span class="inline-flex">
            <span class="cl-txt-orange">8 years</span>
            <span>&nbsp;</span>of
          </span>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt">
          <span>Experience</span>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt inline-flex">
          <span>in</span>
          <div>&nbsp;</div>
          <div
            class="cl-txt-title inline-block 
                    about__history-title-sb
                "
          >
            <div class="about__history-title-inner">
              <SlideText
                data={props.slideText}
                client:visible={{ rootMargin: '100% 0% 100% 0%' }}
              />
            </div>
          </div>
        </div>
        <div class="heading h2 fw-bold about__history-title-txt">
          <span>field</span>
        </div>
      </h2>
    </>
  );
};

export default HistoryHead;
