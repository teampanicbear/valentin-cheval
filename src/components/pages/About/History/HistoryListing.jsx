import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { lerp, cvUnit, inView } from '~/utils/number';
import gsap from 'gsap';
import { getCursor } from '~/components/core/cursor';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import useOutsideAlerter from '~/components/hooks/useClickOutside';
import { getLenis, initLenis, reInitLenisScroll } from '~/components/core/lenis';
import { gGetter, gSetter } from '~/utils/gsap';
import Swiper from 'swiper';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { isSafari } from '~/utils/os';

const HistoryListing = (props) => {
  let historiesRef, popupRef;
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [isPopupOpen, setIsPopupOpen] = createSignal(false);

  onMount(() => {
    if (!historiesRef) return;
    initScrollTrigger();

    if (isSafari())
      document
        .querySelectorAll('.ruler-x li .border-outer')
        .forEach((el) => (el.style.display = 'none'));

    const exploreOnScroll = () => {
      let itemWidth = document.querySelector('.about__history-item').offsetWidth;
      let distance = itemWidth * props.data.length - historiesRef.offsetWidth;

      document.querySelector('.about__history-listing').style.display = 'flex';
      document.querySelector('.about__history-listing').style.flexWrap = 'nowrap';
      document.querySelectorAll('.about__history-item').forEach((el) => {
        el.style.width = `${itemWidth}px`;
      });

      gsap.set('.stick-block', {
        height: distance,
        onComplete: () => {
          ScrollTrigger.refresh(); //refresh after set height
        },
      });
      gsap.set('.sc-about__history', { display: 'flex', flexDirection: 'column-reverse' });
      gsap.set('.about__history', { position: 'static' });
      let isInitInfinite = window.innerWidth > 991 ? false : true;
      let tl;
      requestAnimationFrame(() => {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.about__history',
            start: `bottom-=${cvUnit(100, 'rem')} bottom-=${window.innerWidth > 991 ? 0 : 10}%`,
            endTrigger: '.sc-about__history',
            end: `bottom-=${cvUnit(100, 'rem')} bottom`,
            scrub: 1.2,
            onEnter() {
              if (!isInitInfinite) {
                isInitInfinite = true;
                let lenis = initLenis({ infinite: true });
                reInitLenisScroll(lenis, false);
              }
            },
            onUpdate: (self) => {
              if (window.innerWidth <= 991) {
                let idx = Math.floor(self.progress * props.data.length);
                if (activeIndex() !== idx) {
                  setActiveIndex(idx === props.data.length ? idx - 1 : idx);
                }
              }
            },
          },
        });

        tl.fromTo('.about__history-listing-wrapper', { x: 0 }, { x: -distance, ease: 'none' });
        requestAnimationFrame(() => {
          gsap.set('.sc-about__history, .about__history', { clearProps: 'all' });
        });
      });
      return tl;
    };

    const xGetter = gGetter('x');
    const yGetter = gGetter('y');
    const xSetter = gSetter('x', 'px');
    const ySetter = gSetter('y', 'px');

    let reqID;
    let tlExplore;
    if (window.innerWidth > 767) {
      tlExplore = exploreOnScroll();

      let borderItem = document.querySelectorAll('.border-outer');
      const borderMove = () => {
        if (!document.querySelector('.about__history-body-inner')) return;
        let targetPos = {
          x: xGetter('.mf-cursor'),
          y: yGetter('.mf-cursor'),
        };

        const runBorder = () => {
          borderItem.forEach((el) => {
            let maxElXMove = el.offsetWidth / 2;
            let maxElYMove = el.offsetHeight / 2;
            let elRect = el.getBoundingClientRect();
            let xElMove = lerp(
              xGetter(el.querySelector('.border-inner')),
              targetPos.x - elRect.left - maxElXMove,
              0.1
            );
            let yElMove = lerp(
              yGetter(el.querySelector('.border-inner')),
              targetPos.y - elRect.top - maxElYMove,
              0.1
            );
            xSetter(el.querySelector('.border-inner'))(xElMove);
            ySetter(el.querySelector('.border-inner'))(maxElYMove);
          });
        };
        if (inView(document.querySelector('.about__history-body-inner'))) {
          runBorder();
        }
        reqID = requestAnimationFrame(borderMove);
      };
      reqID = requestAnimationFrame(borderMove);
    } else {
      document
        .querySelector('.about__history-body-inner')
        .querySelectorAll('[data-swiper]')
        .forEach((element) => {
          if (element.getAttribute('data-swiper') == 'swiper') element.classList.add('swiper');
          else element.classList.add(`swiper-${element.getAttribute('data-swiper')}`);
        });

      const swiper = new Swiper(historiesRef, {
        slidesPerView: 1,
        spaceBetween: 0,
        on: {
          slideChange: (slide) => {
            setActiveIndex(slide.realIndex);
          },
        },
      });
    }

    onCleanup(() => {
      tlExplore?.kill();
      cancelAnimationFrame(reqID);
    });
  });
  return (
    <>
      <div class="about__history-body-inner">
        <span class="line"></span>
        <div class="container grid">
          <div ref={historiesRef} class="about__history-listing" data-swiper="swiper">
            <div class="about__history-listing-wrapper" data-swiper="wrapper" data-border-glow>
              {props.data.map((item, idx) => (
                <div
                  class={`about__history-item${activeIndex() === idx ? ' active' : ''}`}
                  data-swiper="slide"
                >
                  <div class="about__history-item-content">
                    <div class="about__history-item-position">
                      <p class="fs-24 fw-med">{item.position.title}</p>
                      <p class="cl-txt-desc">{item.position.type}</p>
                    </div>
                    <div class="about__history-item-company">
                      <p class="fw-med">{item.company.name}</p>
                      <p class="cl-txt-desc about__history-item-company-txt">
                        {item.company.location}
                      </p>
                    </div>
                    <div class="about__history-item-period">
                      <div>
                        <p class="cl-txt-desc">From</p>
                        <p class="fs-20 fw-med">{item.period.from}</p>
                      </div>
                      <div>
                        <p class="cl-txt-desc">To</p>
                        <p class="fs-20 fw-med">{idx === 0 ? 'Present' : item.period.to}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    class="btn btn-circle arrow-hover about__history-item-act"
                    data-cursor-stick
                    data-cursor="-mag-small"
                    onClick={() => {
                      console.log('click');
                      setIsPopupOpen(true);
                      setActiveIndex(idx);
                      getLenis().stop();
                      window.innerWidth > 991 && getCursor().follower.removeState('-mag-small');
                    }}
                  >
                    {props.arrows}
                    <svg
                      class="btn-circle-svg"
                      width="100%"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="49"
                        stroke="white"
                        stroke-opacity=".1"
                        stroke-width="2"
                      />
                    </svg>
                  </button>
                  <ul class="ruler-x">
                    <For each={new Array(13)}>
                      {(dash) => (
                        <li data-border-glow>
                          <div class="border-outer">
                            <div class="border-inner">
                              <div class="glow-el glow-nor"></div>
                            </div>
                          </div>
                        </li>
                      )}
                    </For>
                  </ul>
                  <div class="line" data-border-glow>
                    <div class="border-outer">
                      <div class="border-inner">
                        <div class="glow-el glow-nor"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div class="border-outer bottom">
                <div class="border-inner">
                  <div class="glow-el glow-nor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class={`about__history-popup${isPopupOpen() ? ' active' : ''}`}>
        <div
          class="about__history-popup-overlay"
          onClick={() => {
            setIsPopupOpen(false);
            getLenis().start();
            window.innerWidth > 991 && getCursor().follower.removeState('-text');
          }}
          data-cursor-text="Close"
        ></div>
        <div className="container">
          <div class="about__history-popup-inner" ref={popupRef}>
            <div
              class="about__history-popup-close"
              onClick={() => {
                setIsPopupOpen(false);
                getLenis().start();
              }}
            >
              <span class="about__history-popup-close-line">
                <span></span>
              </span>
              <span class="about__history-popup-close-line">
                <span></span>
              </span>
            </div>
            <div class="about__history-popup-head">
              <div class="about__history-popup-head-inner">
                <p class="fs-24 fw-med cl-txt-title about__history-popup-head-position">
                  {props.data[activeIndex()].position.title}
                </p>
                <p class="cl-txt-desc">
                  {props.data[activeIndex()].company.name} •{' '}
                  {props.data[activeIndex()].position.type}
                </p>
              </div>
              <div class="about__history-popup-head-logo">
                <img
                  src={
                    props.data[activeIndex()].company.logo.src
                      ? props.data[activeIndex()].company.logo.src
                      : props.data[activeIndex()].company.logo
                  }
                  class="img img-h"
                  alt="company logo"
                />
              </div>
            </div>
            <div class="line"></div>
            <div
              class="richtext-global about__history-popup-body"
              data-lenis-prevent
              innerHTML={props.data[activeIndex()].description}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryListing;
