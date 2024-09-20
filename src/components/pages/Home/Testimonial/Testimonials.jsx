import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { createEffect, createSignal, onMount, onCleanup } from 'solid-js';
import Swiper from 'swiper';
import { getCursor } from '~/components/core/cursor';
import { getLenis } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { InterOption, ScrollOption } from '~/utils/helper';
import { cvUnit } from '~/utils/number';
import { breakText } from '~/utils/text';

function TestimonialItem(props) {
  let itemRef;
  onMount(() => {
    if (
      itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight !==
      itemRef.querySelector('.home__testi-item-feedback.shorten').offsetHeight
    ) {
      itemRef.querySelector('.home__testi-item-toggle').classList.add('enable');
    } else {
      document.querySelectorAll('.home__testi-item')[props.index].setAttribute('is-fully', true);
      document.querySelectorAll('.home__testi-item')[props.index].removeAttribute('data-cursor');
      document
        .querySelectorAll('.home__testi-item')
        [props.index].removeAttribute('data-cursor-img');
    }

    let animationTrigger = (height) => ({
      height: height,
      duration: 0.4,
      onComplete() {
        props.wrap.classList.remove('animating');
      },
    });

    const handleToggle = (e) => {
      const feedbackWrap = itemRef.querySelector('.home__testi-item-feedback-wrap');
      const feedbackHeight = itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight;
      feedbackWrap.classList[feedbackWrap.classList.contains('active') ? 'remove' : 'add'](
        'active'
      );

      gsap.to(feedbackWrap, animationTrigger(feedbackHeight));
      e.target.classList.remove('enable');
    };

    const toggleButton = itemRef.querySelector('.home__testi-item-toggle');
    toggleButton.addEventListener('click', handleToggle);

    const textimonialLabel = splitTextFadeUp('.home__testi-title-label');
    const textimonialLabelMb = splitTextFadeUp('.home__testi-title-label');
    const textimonialContent = splitTextFadeUp('.home__testi-title-txt');
    const lines = document
      .querySelector('.home__testi-listing-inner-wrapper')
      .querySelectorAll('.line');

    gsap.set(lines, { scaleX: 0, transformOrigin: 'left' });

    gsap.to(textimonialLabel.words, {
      yPercent: 0,
      duration: 1,
      autoAlpha: 1,
      ease: 'power2.inOut',
      ...ScrollOption('.home__testi-title-label'),
    });
    gsap.to([textimonialContent.words], {
      yPercent: 0,
      duration: 0.8,
      autoAlpha: 1,
      stagger: 0.02,
      ...ScrollOption('.home__testi-title', {
        start: 'top 60%',
      }),
    });
    lines.forEach((line) => {
      const play = () => {
        gsap.to(line, {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 1,
          ease: 'power2.inOut',
        });
      };

      InterOption(line, play);
    });

    onCleanup(() => {
      toggleButton.removeEventListener('click', handleToggle);
    });
  });
  createEffect(() => {
    let animationTrigger = (height) => ({
      height: height,
      duration: 0.4,
      onComplete() {
        props.wrap.classList.remove('animating');
      },
    });

    gsap.to(
      itemRef.querySelector('.home__testi-item-feedback-wrap'),
      props.isOpen
        ? animationTrigger(itemRef.querySelector('.home__testi-item-feedback.fully').scrollHeight)
        : animationTrigger(itemRef.querySelector('.home__testi-item-feedback.shorten').offsetHeight)
    );
  }, [props.isOpen]);
  return (
    <div ref={itemRef} class={`home__testi-item-content grid${props.isOpen ? ' active' : ''}`}>
      <span class="line"></span>
      <p class="heading h4 cl-txt-disable fw-thin home__testi-item-order">
        {(props.index + 1).toString().padStart(2, '0')}.
      </p>
      <div class="home__testi-item-info">
        <p class="fs-24 fw-med cl-txt-title home__testi-item-name">{props.data.name}</p>
        <p class="cl-txt-sub home__testi-item-position">{props.data.position}</p>
      </div>
      <div class="fs-24 fw-thin home__testi-item-feedback-wrap">
        <div class="home__testi-item-feedback shorten">
          <div class="home__testi-item-feedback-txt" innerHTML={breakText(props.data.feedback)} />
        </div>
        <div class="home__testi-item-feedback fully">
          <div class="home__testi-item-feedback-txt" innerHTML={breakText(props.data.feedback)} />
        </div>
      </div>
      <button class="home__testi-item-toggle">
        <span class="fw-med txt-link">Read more</span>
        <span class="fw-med"></span>
      </button>
      <div class="home__testi-item-image">
        <img
          src={props.data.avatar.src}
          alt={props.data.avatar.alt || ''}
          class="img img-fill home__testi-item-image-main"
          width={90}
          height={120}
          loading="lazy"
        />
      </div>
    </div>
  );
}
function Testimonials(props) {
  let containerRef;
  const [activeIndex, setActiveIndex] = createSignal(-1);
  const [scaleFactor, setScaleFactor] = createSignal(1);
  const [activeSlide, setActiveSlide] = createSignal(0);

  const accordionClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  onMount(() => {
    if (!containerRef) return;

    if (window.innerWidth > 767) {
      initScrollTrigger();
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.home__testi-listing',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      tl.to('.home__testi-item', { '--scale-factor': '1', duration: 1, stagger: 0.03 });

      onCleanup(() => {
        swiperImages.destroy(true, false);
        tl.kill();
      });
    } else {
      document
        .querySelector('.home__testi-listing')
        .querySelectorAll('[data-swiper]')
        .forEach((element) => {
          if (element.getAttribute('data-swiper') == 'swiper') element.classList.add('swiper');
          else element.classList.add(`swiper-${element.getAttribute('data-swiper')}`);
        });

      const swiper = new Swiper(containerRef, {
        slidesPerView: 1,
        spaceBetween: cvUnit(16, 'rem'),
        on: {
          slideChange: (slide) => {
            setActiveSlide(slide.realIndex);
            reInitReadmore();
          },
        },
      });

      const reInitReadmore = () => {
        document.querySelectorAll('.home__testi-item-feedback-wrap').forEach((el, idx) => {
          if (el.classList.contains('active')) {
            gsap.to(el, {
              height: el.querySelector('.home__testi-item-feedback.shorten').offsetHeight,
              duration: 0.4,
            });
            el.classList.remove('active');
            document.querySelectorAll('.home__testi-item-toggle')[idx].classList.add('enable');
          }
        });
      };

      const swiperNext = () => {
        swiper.slideNext();
      };
      const swiperPrev = () => {
        swiper.slidePrev();
      };
      document
        .querySelector('.home__testi-navigation-arrow.next')
        .addEventListener('click', swiperNext);
      document
        .querySelector('.home__testi-navigation-arrow.prev')
        .addEventListener('click', swiperPrev);

      onCleanup(() => {
        swiper.destroy(true, false);
        document
          .querySelector('.home__testi-navigation-arrow.next')
          .removeEventListener('click', swiperNext);
        document
          .querySelector('.home__testi-navigation-arrow.prev')
          .removeEventListener('click', swiperPrev);
      });
    }

    const fadeContent = () => {};
    fadeContent();
  });
  return (
    <div className="home__testi-listing-inner" ref={containerRef} data-swiper="swiper">
      <div class="home__testi-control">
        <div class="fw-med home__testi-pagination">
          <span class="cl-txt-title home__testi-pagination-txt">
            {(activeSlide() + 1).toString().padStart(2, '0')}{' '}
          </span>
          <span class="cl-txt-desc">/ {props.data.length.toString().padStart(2, '0')}</span>
        </div>
        <div class="home__testi-navigation">
          <div className="home__testi-navigation-arrow prev">
            <div class="ic ic-20">
              <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.6 8.00003H14M6.19998 3.80005L2 8.00003L6.19998 12.2"
                  stroke="currentColor"
                  stroke-width="1.13137"
                  stroke-miterlimit="10"
                  stroke-linecap="square"
                />
              </svg>
            </div>
          </div>
          <div className="home__testi-navigation-arrow next">
            <div className="ic ic-20">
              <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.4 8.00003H2M9.79997 3.80005L14 8.00003L9.79997 12.2"
                  stroke="currentColor"
                  stroke-width="1.13137"
                  stroke-miterlimit="10"
                  stroke-linecap="square"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div class="home__testi-listing-inner-wrapper" data-swiper="wrapper">
        {props.data.map((el, idx) => (
          <div
            data-cursor-text="More"
            class={`home__testi-item ${activeIndex() === idx ? 'active' : ''}`}
            data-swiper="slide"
            onClick={(e) => {
              if (window.innerWidth > 767) {
                if (
                  containerRef.classList.contains('animating') ||
                  e.target.getAttribute('is-fully')
                )
                  return;
                containerRef.classList.add('animating');
                accordionClick(idx);

                const feedbackShorten = e.target.querySelector(
                  '.home__testi-item-feedback.shorten'
                ).offsetHeight;
                const feedbackFully = e.target.querySelector(
                  '.home__testi-item-feedback.fully'
                ).scrollHeight;
                let expandGap = e.target.classList.contains('active')
                  ? feedbackFully - feedbackShorten
                  : 0;

                gsap.to('.home__testi-listing', {
                  '--expand-gap': expandGap,
                  duration: 0.4,
                  onComplete: () => {
                    // setTimeout(() => {
                    //     getLenis().scrollTo(e.target, {
                    //         offset: cvUnit(-20, 'vh'),
                    //         duration: .4,
                    //         force: true,
                    //         lock: true
                    //     })
                    // }, 100);
                    if (window.innerWidth > 991) {
                      gsap.globalTimeline
                        .getChildren()
                        .filter((e) => e.data === 'footer-timeline')
                        .forEach((el) => el.scrollTrigger.refresh());
                    }
                  },
                });
              }
              const style = getComputedStyle(e.target);
              const scaleFactor = style.getPropertyValue('--scale-factor').trim();
              setScaleFactor(scaleFactor);

              if (window.innerWidth > 991) {
                document.querySelectorAll('.home__testi-item').forEach((el, i) => {
                  if (el.getAttribute('is-fully')) return;
                  if (i === idx) {
                    if (e.target.classList.contains('active')) {
                      el.removeAttribute('data-cursor-text');
                      requestAnimationFrame(() => {
                        getCursor().follower.removeState('-text');
                      });
                    } else {
                      el.setAttribute('data-cursor-text', 'More');
                      requestAnimationFrame(() => {
                        getCursor().follower.addState('-text');
                      });
                    }
                  } else {
                    el.setAttribute('data-cursor-text', 'More');
                  }
                });
              }
            }}
          >
            <TestimonialItem
              wrap={containerRef}
              data={el}
              index={idx}
              scaleFactor={scaleFactor()}
              isOpen={activeIndex() === idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
