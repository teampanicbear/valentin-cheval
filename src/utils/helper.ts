export type TOptions = {
  start?: string;
  end?: string;
  play: () => void;
  revert: () => void;
  scrub?: boolean | number;
  markers?: boolean;
};

export const ScrollOption = (el: HTMLElement, options: TOptions): gsap.TweenVars => {
  const { scrub, start, markers, play, revert } = options || {};
  return {
    scrollTrigger: {
      trigger: el,
      start: start || 'top bottom-=20%',
      once: true,
      onEnter: () => play && play(),
      onLeaveBack: () => revert && revert(),
      scrub,
      markers,
    },
  };
};
