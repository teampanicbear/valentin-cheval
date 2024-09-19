import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const TextBlurFading = (props) => {
  let textRef;

  onMount(() => {
    if (!textRef) return;
    initScrollTrigger();

    const text = SplitType.create(textRef, { types: 'lines, words', lineClass: 'split-line-blur' });
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef,
        scrub: true,
        ...props.triggerOpts,
      },
    });
    tl.fromTo(
      text.words,
      { autoAlpha: 0.15, yPercent: 5 },
      { stagger: 0.4, autoAlpha: 1, yPercent: 0, duration: 5.5, ease: 'back.out(2.0)' },
      0
    ).to(
      text.words,
      {
        keyframes: {
          filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'],
        },
        stagger: 0.4,
        duration: 5.5,
        ease: 'back.out(2.0)',
      },
      0
    );

    onCleanup(() => {
      tl.kill();
      if (text.isSplit) text.revert();
    });
  });
  return <div ref={textRef}>{props.children}</div>;
};

export default TextBlurFading;
