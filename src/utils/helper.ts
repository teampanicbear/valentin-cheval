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
      start: start || `top bottom-=${window.innerWidth > 767 ? 25 : 15}%`,
      once: true,
      onEnter: () => play && play(),
      onLeaveBack: () => revert && revert(),
      scrub,
      markers,
    },
  };
};

export const InterOption = (el: HTMLElement, play: () => void) => {
  let idRequest = null;
  console.log('play', play);
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        idRequest = requestAnimationFrame(() => play());
      } else {
        idRequest && cancelAnimationFrame(idRequest);
      }
    });
  }).observe(el);
};
