import { createSignal, onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from "split-type";
import { cvUnit, percentage } from "~/utils/number";
import { getLenis } from "~/components/core/lenis";
import { breakText } from "~/utils/text";

const ProjectListing = (props) => {
    let projectsRef;
    const [index, setIndex] = createSignal({ curr: 0, prev: -1 });

    let allSplitText = [];
    let elements = [
        { selector: '.project__name-txt' },
        { selector: '.project__desc-txt', optionsIn: { duration: 1 }, optionsOut: { duration: 1 } },
        { selector: '.project__year-txt' },
        { selector: '.home__project-pagination-txt' },
        { selector: '.project__role .project-item-label', optionsIn: { delay: .2 } },
        { selector: '.project__services .project-item-label', optionsIn: { delay: .2 } },
        { selector: '.project__selling .project-item-label', optionsIn: { delay: .2 } },
        { selector: '.project__role-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } },
        { selector: '.project__services-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } },
        { selector: '.project__selling-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } }
    ]

    onMount(() => {
        if (!projectsRef) return;

        document.querySelectorAll('.project__pagination-item-wrap').forEach((el) => {
            el.addEventListener('click', function (e) {
                console.log("click")
                document.querySelectorAll('.project__pagination-item-wrap').forEach(b => b.classList.remove('active'));
                el.classList.add('active');
            })
        })

        gsap.set('.project__thumbnail-img', {
            '--clipOut': (i) => i === 0 ? '100%' : '0%',
            '--clipIn': '0%',
            '--imgTrans': '0%',
            '--imgDirection': '-1',
            zIndex: (i) => props.data.length - i
        });

        elements.forEach((el) => {
            let elementSplitText = []; // Declare a new sub-array for each element

            projectsRef.querySelectorAll(el.selector).forEach((text, idx) => {
                let subSplitText = [];

                if (text.querySelectorAll('p').length > 0) {
                    text.querySelectorAll('p').forEach((paragraph) => {
                        let splittext = new SplitType(paragraph, { types: 'lines, words', lineClass: 'split-line unset-margin' });
                        gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });
                        subSplitText.push(splittext);
                    });
                } else {
                    let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line unset-margin' });
                    gsap.set(splittext.words, { autoAlpha: 0, willChange: 'transform, opacity' });
                    subSplitText.push(splittext);
                }

                elementSplitText.push(subSplitText); // Push to the sub-array
            });

            allSplitText.push(elementSplitText); // Push the sub-array to the main array
        });

        onChangeIndex(0);
        document.querySelector('.projects__listing-main').classList.remove('animating');

        onCleanup(() => {
            elements.forEach(({ selector }) => SplitType.revert(selector));
        });
    })

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

    const pageTransition = () => {
        transitionDOM('name').innerHTML = document.querySelector('.project__name-txt.active').innerHTML
        transitionDOM('info').innerHTML = document.querySelector('.project__info-inner.active').innerHTML;
        transitionDOM('year').innerHTML = `© ${document.querySelector('.project__year-txt.active').innerHTML}`;
        document.querySelector('.project__transition').appendChild(document.querySelector('.project__thumbnail-img.active .project__thumbnail-img-inner'));

        let thumbRect = document.querySelector('.project__thumbnail-wrap').getBoundingClientRect();

        const getBoundingTransition = (attr) => {
            let from = document.querySelector(`.project__${attr}`).getBoundingClientRect();
            let to = document.querySelector(`.projects__position-${attr}`).getBoundingClientRect();
            return { from, to };
        }
        let tl = gsap.timeline({
            defaults: { ease: 'expo.inOut', duration: 1.2 }
        })

        tl
            .fromTo(transitionDOM('name'),
                {
                    x: window.innerWidth > 991 ? getBoundingTransition('name').from.left : 0,
                    y: getBoundingTransition('name').from.top,
                    scale: 1
                },
                {
                    x: window.innerWidth > 991 ? getBoundingTransition('name').to.left : 0,
                    y: getBoundingTransition('name').to.top,
                    scale:
                        window.innerWidth <= 767 ? 1.1428571429 :
                        window.innerWidth <= 991 ? 1.4375 : 2
                })
            .fromTo('.project__thumbnail-img-inner',
                { width: thumbRect.width, height: thumbRect.height, x: thumbRect.left, y: thumbRect.top, filter: 'brightness(.8) grayscale(30%)' },
                {
                    width: '100%',
                    height: percentage(
                        window.innerWidth <= 767 ? 67 :
                        window.innerWidth <= 991 ? 72 : 100, window.innerHeight), x: 0, y: 0, filter: 'brightness(1) grayscale(0%)'
                }, "<=0")
            .to('.project__transition', { autoAlpha: 0, ease: 'linear', duration: 0.4 })

        if (window.innerWidth > 991) {
            tl
                .fromTo(transitionDOM('info'),
                    { x: getBoundingTransition('info').from.left, y: getBoundingTransition('info').from.top },
                    { x: getBoundingTransition('info').to.left, y: getBoundingTransition('info').from.top }, 0)
                .fromTo(transitionDOM('year'),
                    { x: getBoundingTransition('year').from.left, y: getBoundingTransition('year').from.top },
                    { x: getBoundingTransition('year').to.left, y: getBoundingTransition('year').to.top, lineHeight: '1.4em' }, "<=0")
        }
    }

    const animationText = (direction, nextValue) => {
        let yOffSet = {
            out: direction > 0 ? -100 : 100,
            in: direction > 0 ? 100 : -100
        }

        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if (direction !== 0) {
                if (el.isArray) {
                    allSplitText[idx][index().curr].forEach((splittext) => {
                        let tlChild = gsap.timeline({});
                        tlChild.set(splittext.words, { yPercent: 0, autoAlpha: 1 })
                            .to(splittext.words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut', ...el.optionsOut }, '<=0');
                    });
                } else {
                    tl
                        .set(allSplitText[idx][index().curr][0].words, { yPercent: 0, autoAlpha: 1 })
                        .to(allSplitText[idx][index().curr][0].words, { yPercent: yOffSet.out, autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', ...el.optionsOut }, '<=0');
                }
            }

            if (el.isArray) {
                allSplitText[idx][nextValue].forEach((splittext) => {
                    let tlChild = gsap.timeline({});
                    tlChild
                        .set(splittext.words, { yPercent: yOffSet.in, autoAlpha: 0 })
                        .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.inOut', ...el.optionsIn }, '<=0');
                    });
            } else {
                tl
                    .set(allSplitText[idx][nextValue][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, `-=${direction === 0 ? 0 : el.optionsIn?.duration || .8}`)
                    .to(allSplitText[idx][nextValue][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', delay: .2, ...el.optionsIn }, "<=0");
            }
        })
    }

    const animationThumbnail = (direction, nextValue) => {
        if (direction === 0) return;
        let thumbnails = document.querySelectorAll('.project__thumbnail-img');

        let tlTrans = gsap.timeline({
            defaults: {
                ease: 'power3.inOut'
            },
        })
        let tlScale = gsap.timeline({
            defaults: {
                ease: 'power2.inOut'
            },
        })
        tlTrans
            .set(thumbnails[index().curr], {
                '--clipOut': '100%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1',
                duration: 0
            })
            .fromTo(thumbnails[index().curr], {
                '--clipOut': '100%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1',
            }, {
                '--clipOut': direction > 0 ? '0%' : '100%',
                '--clipIn': direction > 0 ? '0%' : '100%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '-1',
                duration: 1,
                ease: 'power2.inOut'
            })
            .set(thumbnails[nextValue], {
                '--clipIn': direction > 0 ? '100%' : '0%',
                '--clipOut': direction > 0 ? '100%' : '0%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '1',
                duration: 0
            }, "<=0")
            .fromTo(thumbnails[nextValue], {
                '--clipIn': direction > 0 ? '100%' : '0%',
                '--clipOut': direction > 0 ? '100%' : '0%',
                '--imgTrans': direction > 0 ? '100%' : '-100%',
                '--imgDirection': '1'
            }, {
                '--clipIn': '0%',
                '--clipOut': '100%',
                '--imgTrans': '0%',
                '--imgDirection': '1',
                duration: 1,
                ease: 'power2.inOut',
                onComplete() {
                    document.querySelector('.projects__listing-main').classList.remove('animating');
                }
            }, "<=0")

        tlScale
            .set(thumbnails[index().curr], {
                '--imgScale': '1',
                duration: 0
            })
            .fromTo(thumbnails[index().curr], {
                '--imgScale': '1',
            }, {
                '--imgScale': '.6',
                duration: 1,
            })
            .set(thumbnails[nextValue], {
                '--imgScale': '1.4',
                duration: 0
            }, "<=0")
            .fromTo(thumbnails[nextValue], {
                '--imgScale': '1.4',
            }, {
                '--imgScale': '1',
                duration: 1,
            }, "<=0")
    }

    const onChangeIndex = (direction) => {
        if (document.querySelector('.projects__listing-main').classList.contains('animating')) return;

        document.querySelector('.projects__listing-main').classList.add('animating');

        let nextValue = index().curr + direction < 0 ? props.data.length - 1 : index().curr + direction > props.data.length - 1 ? 0 : index().curr + direction;
        animationText(direction, nextValue);
        animationThumbnail(direction, nextValue);
        setIndex({ curr: nextValue, prev: index().curr });
    }

    const indexOnWheel = (e) => {
        if (window.innerWidth <= 991) return;

        if (e.deltaY > 0 || e.deltaX > 0) {
            onChangeIndex(1)
        } else if (e.deltaY < 0 || e.deltaX < 0) {
            onChangeIndex(-1)
        }
    }

    return (
        <div class="projects__sticky"
            onWheel={indexOnWheel}
            ref={projectsRef}>
            <div class="container">
                <div class="projects__listing-main grid" >
                    <div class="project__name">
                        <div class="grid-1-1">
                            {props.data.map(({ headingTitle }, idx) => <h2 className={`heading h3 fw-semi cl-txt-title upper project__name-txt${idx === index().curr ? ' active' : ''}`} innerHTML={breakText(headingTitle)}></h2>)}
                        </div>
                    </div>
                    <div class="project__desc">
                        <div className="line"></div>
                        <div class="grid-1-1">
                            {props.data.map(({ excerpt }, idx) => <p className={`project__desc-txt${idx === index().curr ? ' active' : ''}`}>{excerpt}</p>)}
                        </div>
                        <a
                            href={`/${props.data[index().curr].permalink}`}
                            class="cl-txt-orange arrow-hover project__link"
                            onClick={pageTransition}>
                            <span class="txt-link hover-un cl-txt-orange">Explore</span>
                            {props.arrows}
                        </a>
                    </div>
                    <div class="project__info">
                        <div className="grid-1-1">
                            {props.data.map(({ roles, services, sellingPoints }, idx) => (
                                <div class={`project__info-inner${idx === index().curr ? ' active' : ''}`}>
                                    <div className="project__role">
                                        <p class="fw-med cl-txt-desc project-item-label">Role</p>
                                        <div class={`project__role-listing${idx === index().curr ? ' active' : ''}`}>
                                            <For each={roles}>
                                                {(role) => <p class="cl-txt-sub">{role.title}</p>}
                                            </For>
                                        </div>
                                    </div>
                                    <div class="project__services">
                                        <p class="fw-med cl-txt-desc project-item-label">Services</p>
                                        <div class={`project__services-listing${idx === index().curr ? ' active' : ''}`}>
                                            <For each={services}>
                                                {(service) => <p class="cl-txt-sub">{service.title}</p>}
                                            </For>
                                        </div>
                                    </div>
                                    <div class="project__selling">
                                        <p class="fw-med cl-txt-desc project-item-label">Selling points</p>
                                        <div class={`project__selling-listing${idx === index().curr ? ' active' : ''}`}>
                                            <For each={sellingPoints}>
                                                {(points) => <p class="cl-txt-sub">{points.title}</p>}
                                            </For>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div class="fs-20 fw-med cl-txt-sub project__year">©<div class="grid-1-1">{props.data.map(({ year }, idx) => <span class={`project__year-txt${idx === index().curr ? ' active' : ''}`}>{year}</span>)}</div></div>
                    <div class="project__thumbnail-wrap">
                        <div className="project__thumbnail">
                            <div className="project__thumbnail-listing grid-1-1">
                                {props.data.map(({ permalink, image }, idx) => (
                                    <a
                                        href={`/${permalink}`}
                                        class={`project__thumbnail-img${idx === index().curr ? ' active' : ''}`}
                                        data-cursor-text="View"
                                        onClick={pageTransition}
                                    >
                                        <div class="project__thumbnail-img-wrap">
                                            <div class="project__thumbnail-img-inner">
                                                <img class="img img-fill" src={image.src} alt={image.alt || ''} crossorigin="anonymous" referrerpolicy="no-referrer" loading="lazy" />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div class="project__pagination">
                        <div class="project__pagination-main">
                            {props.data.map(({ image }, idx) => (
                                <div class="project__pagination-item-wrap">
                                    <div class="project__pagination-item">
                                        <div class="project__pagination-item-progress">
                                            <div className="project__pagination-item-progress-inner"></div>
                                        </div>
                                        <div class="project__pagination-item-img">
                                            <img src={image.src} alt={image.alt || ''} loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div class="project__pagination-wrap">
                            <span class="line"></span>
                            <div class="fs-20 fw-med project__pagination-number">
                                <div class="grid-1-1">
                                    {props.data.map((_, idx) => (
                                        <span class="cl-txt-title home__project-pagination-txt">{(idx + 1).toString().padStart(2, '0')} </span>
                                    ))}
                                </div>
                                <span class="cl-txt-disable"><span class="slash">/</span>{props.data.length.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="project__control">
                        <div className='project__control-arrow prev' onClick={() => onChangeIndex(-1)}>
                            <div class="ic ic-16">
                                <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.6 8.00003H14M6.19998 3.80005L2 8.00003L6.19998 12.2" stroke="currentColor" stroke-width="1.13137" stroke-miterlimit="10" stroke-linecap="square"/>
                                </svg>
                            </div>
                        </div>
                        <div className='project__control-arrow next' onClick={() => onChangeIndex(1)}>
                            <div className="ic ic-16">
                                <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.4 8.00003H2M9.79997 3.80005L14 8.00003L9.79997 12.2" stroke="currentColor" stroke-width="1.13137" stroke-miterlimit="10" stroke-linecap="square"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="projects__position grid">
                    <div className="heading h2 upper fw-semi projects__position-name" innerHTML={breakText(props.data[index().curr].headingTitle)}></div>
                    <div class="projects__position-info"></div>
                    <div class="fs-20 fw-med projects__position-year">©</div>
                </div>
            </div>
            {/* <div class="projects__navigation">
                <div class="projects__navigation-area prev" onClick={() => onChangeIndex(-1)} data-cursor="-nav" data-cursor-img={props.arrowsIC.prev.src}></div>
                <div class="projects__navigation-area next" onClick={() => onChangeIndex(1)} data-cursor="-nav" data-cursor-img={props.arrowsIC.next.src}></div>
            </div> */}
        </div>
    )
}
export default ProjectListing;