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
        { selector: '.project__role-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } },
        { selector: '.project__services-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } },
        { selector: '.project__selling-listing', isArray: true, optionsIn: { duration: 1, delay: .2 }, optionsOut: { duration: 1 } }
    ]

    onMount(() => {
        if (!projectsRef) return;

        elements.forEach((el) => {
            let elementSplitText = []; // Declare a new sub-array for each element

            projectsRef.querySelectorAll(el.selector).forEach((text, idx) => {
                let subSplitText = [];

                if (text.querySelectorAll('p').length > 0) {
                    text.querySelectorAll('p').forEach((paragraph) => {
                        let splittext = new SplitType(paragraph, { types: 'lines, words', lineClass: 'split-line unset-margin' });
                        gsap.set(splittext.words, { autoAlpha: 0, });
                        subSplitText.push(splittext);
                    });
                } else {
                    let splittext = new SplitType(text, { types: 'lines, words', lineClass: 'split-line unset-margin' });
                    gsap.set(splittext.words, { autoAlpha: 0, });
                    subSplitText.push(splittext);
                }

                elementSplitText.push(subSplitText); // Push to the sub-array
            });

            allSplitText.push(elementSplitText); // Push the sub-array to the main array
        });

        if (transitionDOM().classList.contains('is-returning')) {
            let initIndex = sessionStorage.getItem("currentProject");
            setTimeout(() => {
                animationBackInit(Number(initIndex));
            }, window.innerWidth > 991 ? 0 : 350);
            transitionDOM().classList.remove('can-return');
        }
        else {
            transitionDOM().classList.remove('can-return');
            transitionDOM().removeAttribute('style');
            transitionDOM('name').removeAttribute('style');
            transitionDOM('info').removeAttribute('style');
            transitionDOM('thumbnail').removeAttribute('style');
            transitionDOM('year').removeAttribute('style');
            gsap.set('.project__thumbnail-img', {
                '--clipOut': (i) => i === 0 ? '100%' : '0%',
                '--clipIn': '0%',
                '--imgTrans': '0%',
                '--imgDirection': '-1',
                zIndex: (i) => props.data.length - i
            });
            changeIndex.onWheel(0);
            document.querySelector('.projects__listing-main').classList.remove('animating');
        }

        const handleSwipe = (e) => {
            const startX = e.clientX;
            const startY = e.clientY;

            const handleTouchMove = (e) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        changeIndex.onWheel(-1)
                    } else {
                        changeIndex.onWheel(1)
                    }
                }
            };
            document.querySelector('.projects__listing-main').ontouchmove = (e) => handleTouchMove(e.touches[0]);
        };

        if (window.innerWidth <= 767) {
            document.querySelector('.projects__listing-main').ontouchstart = (e) => handleSwipe(e.touches[0]);
        }

        onCleanup(() => {
            // elements.forEach(({ selector }) => SplitType.revert(selector));
        });
    })

    const transitionDOM = (attr) => attr ? document.querySelector(`.project__transition [data-project-${attr}]`) : document.querySelector('.project__transition');

    const pageTransition = () => {
        let thumbRect = document.querySelector('.project__transition-thumbnail-area').getBoundingClientRect();

        const getBoundingTransition = (attr) => {
            let from = transitionDOM(attr).getBoundingClientRect();
            let to = document.querySelector(`.projects__position-${attr}`).getBoundingClientRect();
            return { from, to };
        }

        gsap.set(transitionDOM(), { autoAlpha: 1, duration: 0 });
        transitionDOM().classList.add('can-return');
        let tl = gsap.timeline({
            defaults: { ease: 'expo.inOut', duration: 1.2 }
        })
        tl
            .fromTo(transitionDOM('name'),
                {
                    y: window.innerWidth > 767 ? getBoundingTransition('name').from.top : 0,
                    scale: 1
                },
                {
                    y: window.innerWidth > 767 ? getBoundingTransition('name').to.top : (document.querySelector(`.projects__position-name`).offsetTop - transitionDOM('name').offsetTop),
                    scale:
                        window.innerWidth <= 767 ? 1.1428571429 :
                        window.innerWidth <= 991 ? 1.4375 : 2
                })
            .fromTo(transitionDOM('thumbnail'),
                { width: thumbRect.width, height: thumbRect.height, x: thumbRect.left, y: thumbRect.top },
                {
                    width: '100%',
                    height: percentage(
                        window.innerWidth <= 767 ? 67 :
                            window.innerWidth <= 991 ? 72 : 100, window.innerHeight),
                    x: 0,
                    y: 0
                    // filter: 'brightness(1) grayscale(0%)'
                }, "<=0")
            .to(transitionDOM(), { autoAlpha: 0, ease: 'linear', duration: 0.4 })
        if (window.innerWidth > 991) {
            tl
                .fromTo(transitionDOM('info'),
                    { x: 0 },
                    {
                        x: getBoundingTransition('info').to.left - getBoundingTransition('info').from.left,
                        // y: getBoundingTransition('info').from.top
                    }, 0)
                .fromTo(transitionDOM('year'),
                    { x: 0 },
                    { x:  getBoundingTransition('year').to.left - getBoundingTransition('year').from.left,
                        // y: getBoundingTransition('year').to.top,
                    }, "<=0")
        }
        else {
            tl.fromTo('.project__transition-thumbnail-gradient',
            { autoAlpha: 0 },
            { autoAlpha: 1 }, "<=0")
        }
    }

    const animationBackInit = (initIndex) => {
        let ignoreElement = window.innerWidth > 991 ? ['.project__desc-txt'] : ['.project__role-listing', '.project__services-listing', '.project__selling-listing', '.project__desc-txt', '.project__year-txt', '.home__project-pagination-txt'];
        let yOffSet = {
            out: -100,
            in: 100
        }

        elements.forEach((el, idx) => {
            if (ignoreElement.includes(el.selector)) {
                let tl = gsap.timeline({});

                if (el.isArray) {
                    allSplitText[idx][initIndex].forEach((splittext) => {
                        let tlChild = gsap.timeline({});
                        tlChild
                            .set(splittext.words, { yPercent: yOffSet.in, autoAlpha: 0 })
                            .to(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.inOut', ...el.optionsIn }, '<=0');
                        });
                } else {
                    tl
                        .set(allSplitText[idx][initIndex][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, `-=0`)
                        .to(allSplitText[idx][initIndex][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', delay: .2, ...el.optionsIn }, "<=0");
                }
            }
            else {
                if (el.isArray) {
                    allSplitText[idx][initIndex].forEach((splittext) => {
                        gsap.set(splittext.words, { yPercent: 0, autoAlpha: 1, duration: 0 });
                    });
                } else {
                    gsap.set(allSplitText[idx][initIndex][0].words, { yPercent: 0, autoAlpha: 1, duration: 0 });
                }
            }
        })

        gsap.set('.project__thumbnail-img', {
            '--clipOut': (i) => i === initIndex ? '100%' : '0%',
            '--clipIn': '0%',
            '--imgTrans': '0%',
            '--imgDirection': '-1',
        });
        document.querySelectorAll('.project__pagination-item-wrap').forEach((el, _idx) => {
            el.classList[_idx === initIndex ? 'add' : 'remove']('active');
        })
        setIndex({ curr: initIndex, prev: index().curr });
    }

    const animationText = (nextValue, direction) => {
        let _direction = direction || nextValue - index().curr;
        let yOffSet = {
            out: _direction > 0 ? -100 : 100,
            in: _direction > 0 ? 100 : -100
        }

        elements.forEach((el, idx) => {
            let tl = gsap.timeline({});

            if (_direction !== 0) {
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
                    .set(allSplitText[idx][nextValue][0].words, { yPercent: yOffSet.in, autoAlpha: 0 }, `-=${_direction === 0 ? 0 : el.optionsIn?.duration || .8}`)
                    .to(allSplitText[idx][nextValue][0].words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', delay: .2, ...el.optionsIn }, "<=0");
            }
        })
    }

    const animationThumbnail = (nextValue, direction) => {
        let _direction = direction || nextValue - index().curr;
        if (_direction === 0) return;

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
                '--clipOut': _direction > 0 ? '0%' : '100%',
                '--clipIn': _direction > 0 ? '0%' : '100%',
                '--imgTrans': _direction > 0 ? '100%' : '-100%',
                '--imgDirection': '-1',
                duration: 1,
                ease: 'power2.inOut'
            })
            .set(thumbnails[nextValue], {
                '--clipIn': _direction > 0 ? '100%' : '0%',
                '--clipOut': _direction > 0 ? '100%' : '0%',
                '--imgTrans': _direction > 0 ? '100%' : '-100%',
                '--imgDirection': '1',
                duration: 0
            }, "<=0")
            .fromTo(thumbnails[nextValue], {
                '--clipIn': _direction > 0 ? '100%' : '0%',
                '--clipOut': _direction > 0 ? '100%' : '0%',
                '--imgTrans': _direction > 0 ? '100%' : '-100%',
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

    const toNextIndex = (nextIndex, direction) => {
        if (document.querySelector('.projects__listing-main').classList.contains('on-wheel')) return;
        console.log("run")
        if (document.querySelector('.projects__listing-main').classList.contains('animating')) return;

        document.querySelector('.projects__listing-main').classList.add('animating');
        animationText(nextIndex, direction);
        animationThumbnail(nextIndex, direction);
        document.querySelectorAll('.project__pagination-item-wrap').forEach((el, _idx) => {
            el.classList[_idx === nextIndex ? 'add' : 'remove']('active');
        })

        transitionDOM('name').innerHTML = breakText(props.data[nextIndex].headingTitle);

        transitionDOM('info-role').innerHTML = '';
        props.data[nextIndex].roles.forEach(({ title }) => {
            let p = document.createElement("p");
            p.className = "cl-txt-sub-solid";
            p.textContent = title;
            transitionDOM('info-role').appendChild(p);
        })

        transitionDOM('info-service').innerHTML = '';
        props.data[nextIndex].services.forEach(({ title }) => {
            let p = document.createElement("p");
            p.className = "cl-txt-sub-solid";
            p.textContent = title;
            transitionDOM('info-service').appendChild(p);
        })

        transitionDOM('info-selling').innerHTML = '';
        props.data[nextIndex].sellingPoints.forEach(({ title }) => {
            let p = document.createElement("p");
            p.className = "cl-txt-sub-solid";
            p.textContent = title;
            transitionDOM('info-selling').appendChild(p);
        })

        transitionDOM('thumbnail').querySelector('img')?.remove();
        let thumbnail = document.createElement("img");
        thumbnail.className = "img img-fill";
        thumbnail.src = props.data[nextIndex].image.src;
        thumbnail.alt = '';
        transitionDOM('thumbnail').appendChild(thumbnail);

        transitionDOM('year').querySelector('.project__transition-year-current').innerHTML = '';
        transitionDOM('year').querySelector('.project__transition-year-current').textContent = props.data[nextIndex].year;

        setIndex({ curr: nextIndex, prev: index().curr });
    }

    const changeIndex = {
        onWheel: (direction) => {
            let nextValue = index().curr + direction < 0 ? props.data.length - 1 : index().curr + direction > props.data.length - 1 ? 0 : index().curr + direction;
            toNextIndex(nextValue, direction);
        },
        onClick: (index) => toNextIndex(index)
    }

    let wheelTimeout;
    const indexOnWheel = (e) => {
        if (window.innerWidth <= 991) return;

        requestAnimationFrame(() => document.querySelector('.projects__listing-main').classList.add('on-wheel'));

        clearTimeout(wheelTimeout);

        if (e.deltaY > 0) {
            changeIndex.onWheel(1)
        } else if (e.deltaY < 0) {
            changeIndex.onWheel(-1)
        }

        wheelTimeout = setTimeout(() => {
            document.querySelector('.projects__listing-main').classList.remove('on-wheel');
        }, 150); // Adjust this value as needed
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
                        <p class="fw-med cl-txt-desc project-item-label">Description</p>
                        <div class="grid-1-1">
                            {props.data.map(({ excerpt }, idx) => <p className={`cl-txt-sub project__desc-txt${idx === index().curr ? ' active' : ''}`}>{excerpt}</p>)}
                        </div>
                        <a
                            href={`/${props.data[index().curr].permalink}`}
                            class="cl-txt-orange arrow-hover project__link"
                            onClick={pageTransition}>
                            <span class="txt-link hover-un cl-txt-orange">Explore</span>
                            {props.arrows}
                        </a>
                    </div>
                    <div class="cl-txt-sub project__scrollDown">(Scroll down)</div>
                    <div class="project__info">
                        <div class="project__info-inner">
                            <div class="project__role">
                                <p class="fw-med cl-txt-desc project-item-label">Role</p>
                                <div className="grid-1-1">
                                    {props.data.map(({ roles }, idx) => (
                                        <div class={`project__role-listing${idx === index().curr ? ' active' : ''}`} style={{ '--max-line': '3' }}>
                                            <For each={roles}>
                                                {(role) => <p class="cl-txt-sub">{role.title}</p>}
                                            </For>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div class="project__services">
                                <p class="fw-med cl-txt-desc project-item-label">Services</p>
                                <div className="grid-1-1">
                                    {props.data.map(({ services }, idx) => (
                                        <div class={`project__services-listing${idx === index().curr ? ' active': ''}`} style={{ '--max-line': '3' }}>
                                            <For each={services}>
                                                {(service) => <p class="cl-txt-sub">{service.title}</p>}
                                            </For>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div class="project__selling">
                                <p class="fw-med cl-txt-desc project-item-label">Selling points</p>
                                <div className="grid-1-1">
                                    {props.data.map(({ sellingPoints }, idx) => (
                                        <div class={`project__selling-listing ${idx === index().curr ? ' active' : ''}`} style={{ '--max-line': '2' }}>
                                            <For each={sellingPoints}>
                                                {(point) => <p class="cl-txt-sub">{point.title}</p>}
                                            </For>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cl-txt-sub project__year"><span class="project__year-copyright">©</span>
                        <div class="project__year-current">
                            <span>20</span><div class="grid-1-1">{props.data.map(({ year }, idx) => <span class={`project__year-txt${idx === index().curr ? ' active' : ''}`}>{year.slice(-2)}</span>)}</div>
                        </div>
                    </div>
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
                                <div class="project__pagination-item-wrap"
                                    onClick={() => changeIndex.onClick(idx)}
                                    data-cursor="-hidden" data-cursor-stick>
                                    <div class="txt-link project__pagination-item">
                                        <div class="project__pagination-item-progress">
                                            <div class="project__pagination-item-progress-bg"></div>
                                        </div>
                                        <div class="project__pagination-item-img">
                                            <img src={image.src} alt={image.alt || ''} loading="lazy" class="img img-h"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div class="project__pagination-wrap">
                            <span class="line"></span>
                            <div class="fs-20 fw-med project__pagination-number">
                                <div class="cl-txt-title project__pagination-number-current">
                                    {props.data.length < 10 && <span>0</span>}
                                    <div class="grid-1-1">
                                        {props.data.map((_, idx) => (
                                            <span class="home__project-pagination-txt">{idx +1}</span>
                                        ))}
                                    </div>
                                </div>
                                <span class="cl-txt-disable"><span class="slash">/</span> {props.data.length.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="project__control">
                        <div className='project__control-arrow prev' onClick={() => changeIndex.onWheel(-1)}>
                            <div class="ic ic-16">
                                <svg width="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.6 8.00003H14M6.19998 3.80005L2 8.00003L6.19998 12.2" stroke="currentColor" stroke-width="1.13137" stroke-miterlimit="10" stroke-linecap="square"/>
                                </svg>
                            </div>
                        </div>
                        <div className='project__control-arrow next' onClick={() => changeIndex.onWheel(1)}>
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
                    <div class="projects__position-info">
                        <div class="projects__position-info-inner">
                            <p className="fw-med cl-txt-desc projects__position-info-label">Role</p>
                            <div class="projects__position-info-listing" style={{ '--max-line': '3' }}>
                                <For each={props.data[index().curr].roles}>
                                    {(role) => <p class="cl-txt-sub">{role.title}</p>}
                                </For>
                            </div>
                        </div>
                        <div class="projects__position-info-inner">
                            <p className="fw-med cl-txt-desc projects__position-info-label">Services</p>
                            <div class="projects__position-info-listing" style={{ '--max-line': '3' }}>
                                <For each={props.data[index().curr].services}>
                                    {(service) => <p class="cl-txt-sub">{service.title}</p>}
                                </For>
                            </div>
                        </div>
                        <div className="projects__position-info-inner">
                            <p className="fw-med cl-txt-desc projects__position-info-label">Selling points</p>
                            <div class="projects__position-info-listing" style={{ '--max-line': '2' }}>
                                <For each={props.data[index().curr].sellingPoints}>
                                    {(point) => <p class="cl-txt-sub">{point.title}</p>}
                                </For>
                            </div>
                        </div>
                    </div>
                    <div class="projects__position-year">©</div>
                </div>
            </div>
        </div>
    )
}
export default ProjectListing;