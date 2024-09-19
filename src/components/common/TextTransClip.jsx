import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const TextTransClip = (props) => {
  let textRef;

  onMount(() => {
    if (!textRef) return;

    initScrollTrigger();
    const q = gsap.utils.selector(textRef);
    let rect = textRef.getBoundingClientRect();
    let topPos = window.pageYOffset || document.documentElement.scrollTop;
    let offsetTop = rect.top + topPos;

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef,
        start: `top ${(props.startSelf && offsetTop) || 'bottom'}`,
        end: `bottom top+=${(props.startSelf && '0') || window.innerHeight / 2 + textRef.offsetHeight}`,
        scrub: true,
        markers: props.markers,
        ...props.triggerOpts,
      },
    });
    if (props.reverse) {
      tl.fromTo(
        [q('.trans-line-above'), q('.trans-line-under')],
        { yPercent: 0 },
        { yPercent: -100, ease: 'linear', duration: 1 }
      );
    } else {
      tl.fromTo(
        [q('.trans-line-above'), q('.trans-line-under')],
        { yPercent: 0 },
        { yPercent: 100, ease: 'linear', duration: 1 }
      );
    }

    onCleanup(() => tl.kill());
  });

  return (
    <div ref={textRef}>
      <div class="trans-line">
        <div class="trans-line-above">{props.children}</div>
        <div class="trans-line-under">{props.children}</div>
      </div>
    </div>
  );
};

export default TextTransClip;
