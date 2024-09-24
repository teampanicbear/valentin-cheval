import { onCleanup, onMount } from 'solid-js';
import gsap from 'gsap';
import SplitType from 'split-type';
import { cvUnit } from '~/utils/number';
import { isSafari } from '~/utils/os';

function SlideText(props) {
  let slideRef;
  let tlMaster;
  let isAllowClick = false;
  let isHover = false;
  let isStart = false;
  let currProg;

  onMount(() => {
    if (!slideRef) return;
    tlMaster = gsap.timeline({
      paused: true,
      onUpdate: () => {
        if (props.interaction) {
          handleOver();
        }
      },
      onComplete: () => {
        tlMaster.progress(0);
      },
    });
    gsap.set(slideRef.querySelectorAll('.slide-txt-item'), {
      transformOrigin: props.rootOrigin
        ? 'center center -.1em !important'
        : 'center center -.26em !important',
    });
    slideRef.querySelectorAll('.slide-txt-item').forEach((text, idx) => {
      let dur = 3;
      let ease = 'expo.inOut';
      let transform = {
        out: `translate3d(0px, ${cvUnit(25.5961, 'rem')}px, -${cvUnit(26.0468, 'rem')}px) rotateX(-91deg)`,
        in: `translate3d(0px, -${cvUnit(25.5961, 'rem')}px, -${cvUnit(26.0468, 'rem')}px) rotateX(91deg)`,
      };
      if (idx == props.data.length - 1) {
        gsap.set(text, { transform: 'none', autoAlpha: 1 });
      } else {
        gsap.set(text, { transform: transform.out, autoAlpha: 0 });
      }
      let tlChild = gsap.timeline({});

      if (idx === props.data.length - 1) {
        tlChild
          .set(text, { transform: 'none', autoAlpha: 1 })
          .to(text, { transform: transform.in, autoAlpha: 0, duration: dur, ease: ease }, '<=0')
          .to(text, { duration: dur * idx - 1 * dur })

          .set(text, { transform: transform.out, autoAlpha: 0 })
          .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease });
      } else {
        tlChild
          .set(text, { transform: transform.out, autoAlpha: 0 })
          .to(text, { duration: dur * idx }, '<=0')
          .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease })
          .to(text, { transform: transform.in, autoAlpha: 0, duration: dur, ease: ease })
          .to(text, { duration: (props.data.length - 2 - idx) * dur });
      }
      tlMaster.add(tlChild, 0);
    });

    if (props.interaction) {
      if (window.innerWidth > 768) {
        slideRef.addEventListener('click', handleClick);
        slideRef.addEventListener('mouseleave', handleOut);
      }
    }
    if (isSafari()) {
      gsap.set(slideRef, { perspective: 'unset' });
    }
  });

  const onStart = () => {
    if (isStart) return;

    isStart = true;
    tlMaster.play();
  };
  const handleOut = () => {
    isHover = false;
    tlMaster.play();
  };
  const handleOver = () => {
    if (window.innerWidth < 768) return;
    if (slideRef.matches(':hover')) {
      if (!isHover) {
        isAllowClick = false;
        isHover = true;
        currProg = tlMaster.progress();
        tlMaster.timeScale(2);
      }
      let curIdx = Math.floor(currProg / (1 / props.data.length).toFixed(2));
      let nextIdx = curIdx + 1;
      let nextProgress = (nextIdx / props.data.length).toFixed(2);
      // console.log(currProg, nextProgress)
      if (tlMaster.progress() >= nextProgress) {
        tlMaster.pause();
        tlMaster.timeScale(1);
        isAllowClick = true;
      }
    } else {
      tlMaster.timeScale(1);
    }
  };
  const handleClick = () => {
    if (slideRef.matches(':hover')) {
      if (!isAllowClick) return;
      isAllowClick = false;
      let curr = tlMaster.progress();
      let curIdx = Math.floor(curr / (1 / props.data.length).toFixed(2));
      let nextIdx = curIdx + 1;
      let nextProgress = (nextIdx / props.data.length).toFixed(2);
      console.log(curr, nextProgress);
      gsap.fromTo(
        tlMaster,
        { progress: curr },
        {
          progress: nextProgress,
          duration: (tlMaster.totalDuration() / props.data.length) * 0.5,
          ease: 'power1.out',
          onComplete: () => {
            if (curIdx == props.data.length) {
              curIdx = 0;
              tlMaster.progress(0);
            }
            isAllowClick = true;
          },
        }
      );
    }
  };

  return (
    <>
      <div
        class="grid-1-1 slide-txt-wrap"
        ref={slideRef}
        onClick={onStart}
        style={{ width: 'max-content' }}
      >
        {props.data.map((text) => (
          <div class={`slide-txt-item ${props.rootOrigin ? 'root-origin' : ''}`}>{text}</div>
        ))}
      </div>
      <style jsx>
        {`
          .slide-txt-wrap {
            perspective: 82.5rem;
            overflow: hidden;
          }
          .slide-txt-item {
            backface-visibility: hidden;
            transform-origin: center center -0.26em !important;
          }
          .slide-txt-item.root-origin {
            transform-origin: center center -0.1em !important;
          }
        `}
      </style>
    </>
  );
}

export default SlideText;
