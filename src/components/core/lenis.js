import Lenis from 'lenis';

let lenis;

function initLenis(options = {}) {
  lenis = new Lenis({
    smooth: true,
    infinite: window.innerWidth > 991 ? true : false,
    content:
      window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper-inner'),
    wrapper:
      window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
    ...options,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  lenis.stop();

  return lenis;
}

function getLenis(options = {}) {
  if (!lenis) {
    initLenis(options);
  } else if (Object.keys(options).length > 0) {
    // Reinitialize Lenis if new options are provided
    initLenis(options);
  }
  return lenis;
}

function headerOnScroll(inst) {
  const header = document.querySelector('header');
  if (!header) return;
  header.classList.add('on-scroll');
  // if (document.querySelector('[data-infinite]')) {
  // }
  // else {
  //     if (inst.scroll > header.offsetHeight) {
  //         header.classList.add("on-scroll");
  //     } else {
  //         header.classList.remove('on-scroll');
  //     }
  // }

  //home case
  if (document.querySelector('[data-namespace="home"]')) {
    header.classList.add('on-home');
    const homeHeroBreak = document.querySelector('.home__hero-main .home__hero-name').offsetTop;
    const homeFooterBreak = document.querySelector('.home-footer-hero').offsetTop;

    if (window.innerWidth <= 767) {
      header.classList.toggle('on-home-hero', inst.scroll < homeHeroBreak);
    } else {
      header.classList.toggle('on-home-hero', inst.scroll < homeHeroBreak || inst.scroll > homeFooterBreak);
    }
  } else {
    header.classList.remove('on-home');
  }
  //projects case
  if (document.querySelector('[data-namespace="projects"')) {
    document.documentElement.style.overflow = 'hidden';
  } else {
    document.documentElement.removeAttribute('style');
  }
  //project case
  if (document.querySelector('[data-namespace="project"]')) {
    header.classList.add('on-project');
  } else {
    header.classList.remove('on-project');
  }
}
function applyOnScroll(inst) {
  headerOnScroll(inst);
}

function reInitLenisScroll(_lenis, isProjectPage) {
  applyOnScroll(_lenis);
  _lenis.on('scroll', function (inst) {
    applyOnScroll(inst);
  });

  setTimeout(
    () => {
      _lenis.start();
    },
    isProjectPage ? 800 : 0
  );
}

export { initLenis, getLenis, applyOnScroll, reInitLenisScroll };
