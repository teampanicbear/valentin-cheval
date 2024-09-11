import { createSignal, For, onCleanup, onMount } from "solid-js";
import { lerp, cvUnit, inView } from "~/utils/number";
import gsap from 'gsap';
import { getCursor } from "~/components/core/cursor";
import { initScrollTrigger } from "~/components/core/scrollTrigger";
import useOutsideAlerter from "~/components/hooks/useClickOutside";
import { getLenis } from "~/components/core/lenis";
import { gGetter, gSetter } from "~/utils/gsap";

const HistoryListing = (props) => {
    let historiesRef, popupRef;
    const [activeIndex, setActiveIndex] = createSignal(0);
    const [isPopupOpen, setIsPopupOpen] = createSignal(false);

    onMount(() => {
        if (!historiesRef) return;
        initScrollTrigger();

        let itemWidth = document.querySelector('.about__history-item').offsetWidth;
        document.querySelectorAll('.about__history-item').forEach((el) => {
            el.style.width = `${itemWidth}px`;
        })
        document.querySelector('.about__history-listing').style.display = 'flex';
        document.querySelector('.about__history-listing').style.flexWrap = 'nowrap';
        let distance = (itemWidth * props.data.length) - historiesRef.offsetWidth;

        gsap.set('.stick-block', { height: distance });
        gsap.set('.sc-about__history', { display: 'flex', flexDirection: 'column-reverse' });
        gsap.set('.about__history', { position: 'static' });

        let tl;
        requestAnimationFrame(() => {
            tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.about__history',
                    start: `bottom-=${cvUnit(100, 'rem')} bottom-=${window.innerWidth > 991 ? 0 : 10 }%`,
                    endTrigger: '.sc-about__history',
                    end: `bottom-=${cvUnit(100, 'rem')} bottom`,
                    scrub: 1.2,
                    onUpdate: (self) => {
                        if (window.innerWidth <= 991) {
                            let idx = Math.floor(self.progress * props.data.length)
                            if (activeIndex() !== idx) {
                                setActiveIndex(idx === props.data.length ? idx - 1 : idx)
                            }
                        }
                    }
                }
            })

            tl
            .fromTo('.about__history-listing-wrapper', { x: 0 }, { x: -distance, ease: 'none' });
            requestAnimationFrame(() => {
                gsap.set('.sc-about__history, .about__history', { clearProps: 'all' });
            })
        })

        let borderItem = document.querySelectorAll('.border-outer');

        const xGetter = gGetter('x');
        const yGetter = gGetter('y');
        const xSetter = gSetter('x', 'px');
        const ySetter = gSetter('y', 'px');

        let reqID;
        const borderMove = () => {
            if (!document.querySelector('.about__history-body-inner')) return;
            let targetPos = {
                x: xGetter('.mf-cursor'),
                y: yGetter('.mf-cursor')
            };
            const runBorder = () => {
                borderItem.forEach((el) => {
                    let maxElXMove = el.offsetWidth / 2;
                    let maxElYMove = el.offsetHeight / 2;
                    let elRect = el.getBoundingClientRect();
                    let xElMove = lerp(xGetter(el.querySelector('.border-inner')), targetPos.x - elRect.left - maxElXMove, .1);
                    let yElMove = lerp(yGetter(el.querySelector('.border-inner')), targetPos.y - elRect.top - maxElYMove, .1);
                    xSetter(el.querySelector('.border-inner'))(xElMove);
                    ySetter(el.querySelector('.border-inner'))(maxElYMove);
                    
                })
            }
            if (inView(document.querySelector('.about__history-body-inner'))) {
                runBorder();
            }
            reqID = requestAnimationFrame(borderMove);
        }
        reqID = requestAnimationFrame(borderMove);

        onCleanup(() => {
            tl.kill();
            cancelAnimationFrame(reqID);
        })
    })
    return (
        <>
            <div class="about__history-body-inner">
                <span class="line"></span>
                <div class="container grid">
                    <div ref={historiesRef} class="about__history-listing">
                        <div class="about__history-listing-wrapper" data-border-glow data-glow-option='{ "inset": "-1px", "opacity": ".8"}'>
                            {props.data.map((item, idx) => (
                                <div class={`about__history-item${activeIndex() === idx ? ' active' : ''}`}>
                                    <div class="about__history-item-content">
                                        <div class="about__history-item-position">
                                            <p class="fs-24 fw-med">{item.position.title}</p>
                                            <p class="cl-txt-desc">{item.position.type}</p>
                                        </div>
                                        <div class="about__history-item-company">
                                            <p class="fw-med">{item.company.name}</p>
                                            <p class="cl-txt-desc about__history-item-company-txt">{item.company.location}</p>
                                        </div>
                                        <div class="about__history-item-period">
                                            <div>
                                                <p class="cl-txt-desc">From</p>
                                                <p class="fs-20 fw-med">{item.period.from}</p>
                                            </div>
                                            <div>
                                                <p class="cl-txt-desc">To</p>
                                                <p class="fs-20 fw-med">{item.period.to}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn btn-circle arrow-hover about__history-item-act" data-magnetic data-cursor-stick data-cursor='-mag-small'
                                        onClick={() => {
                                            setIsPopupOpen(true);
                                            setActiveIndex(idx);
                                            getLenis().stop();
                                            window.innerWidth > 991 && getCursor().follower.removeState('-mag-small');
                                        }}
                                    >
                                        {props.arrows}
                                        <svg class="btn-circle-svg" width="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="50" cy="50" r="49" stroke="white" stroke-opacity=".1" stroke-width="2"/>
                                        </svg>
                                    </button>
                                    <ul class="ruler-x">
                                        <For each={new Array(13)}>
                                            {(dash) => <li data-border-glow data-glow-option='{ "inset": "-1px", "opacity": ".8"}'>
                                                    <div class="border-outer"><div class="border-inner"><div class="glow-el glow-nor"></div></div></div>
                                                </li>}
                                        </For>
                                    </ul>
                                    <div class="line" data-border-glow data-glow-option='{ "inset": "-1px", "opacity": ".8"}'>
                                        <div class="border-outer"><div class="border-inner"><div class="glow-el glow-nor"></div></div></div>
                                    </div>
                                    
                                </div>
                            ))}
                            <div class="border-outer bottom"><div class="border-inner"><div class="glow-el glow-nor"></div></div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class={`about__history-popup${isPopupOpen() ? ' active' : ''}`}>
                <div class="about__history-popup-overlay"
                    data-cursor="-stroke"
                    onClick={() => {
                        setIsPopupOpen(false);
                        getLenis().start();
                        window.innerWidth > 991 && getCursor().follower.removeState('-media');
                    }}
                    data-cursor-img={props.closeIc}></div>
                <div className="container">
                    <div class="about__history-popup-inner" ref={popupRef}>
                        <div
                            class="about__history-popup-close"
                            onClick={() => {
                                setIsPopupOpen(false);
                                getLenis().start();
                            }}>
                            <span class="about__history-popup-close-line">
                                <span></span>
                            </span>
                            <span class="about__history-popup-close-line">
                                <span></span>
                            </span>
                        </div>
                        <div class="about__history-popup-head">
                            <div class="about__history-popup-head-inner">
                                <p class="fs-24 fw-med cl-txt-title about__history-popup-head-position">{props.data[activeIndex()].position.title}</p>
                                <p class="cl-txt-desc">{props.data[activeIndex()].company.name} • {props.data[activeIndex()].position.type}</p>
                            </div>
                            <div class="about__history-popup-head-logo">
                                <img src={props.data[activeIndex()].company.logo.src} class="img img-h" alt="company logo" />
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="richtext-global about__history-popup-body" data-lenis-prevent innerHTML={props.data[activeIndex()].description}></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HistoryListing;