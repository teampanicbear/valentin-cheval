import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { percentage } from '~/utils/number';
import { breakText } from '~/utils/text';

const PostScript = (props) => {
    let scriptRef;

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)
    const setUpPageTransition = (data) => {
        if (document.querySelector('.project__transition').classList.contains('can-return')) {
        }
        else {
            gsap.set(transitionDOM('name'), {
                y: document.querySelector('.post__hero-title').getBoundingClientRect().top - (window.innerWidth <= 767 ? transitionDOM('name').getBoundingClientRect().top : 0),
                scale:
                    window.innerWidth <= 767 ? 1.1428571429 :
                    window.innerWidth <= 991 ? 1.4375 : 2,
                duration: 0
            })

            let infoPos = document.querySelector('.post__hero-info').getBoundingClientRect().left - transitionDOM('info').offsetLeft;
            gsap.set(transitionDOM('info'), { x: infoPos, duration: 0 })
            gsap.set(transitionDOM('year'), { x: infoPos, duration: 0 })

            gsap.set(transitionDOM('thumbnail'), {
                width: '100%',
                height: percentage(
                    window.innerWidth <= 767 ? 67 :
                    window.innerWidth <= 991 ? 72 : 100, window.innerHeight),
                x: 0, y: 0
            })

            transitionDOM('name').innerHTML = '';
            transitionDOM('name').innerHTML = breakText(data.headingTitle);

            transitionDOM('info-role').innerHTML = '';
            data.roles.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub-solid";
                p.textContent = title;
                transitionDOM('info-role').appendChild(p);
            });

            transitionDOM('info-service').innerHTML = '';
            data.services.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub-solid";
                p.textContent = title;
                transitionDOM('info-service').appendChild(p);
            });

            transitionDOM('info-selling').innerHTML = '';
            data.sellingPoints.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub-solid";
                p.textContent = title;
                transitionDOM('info-selling').appendChild(p);
            });
            document.querySelector('.project__transition-info-label.sellings').classList[data.sellingPoints.length === 0 ? 'add' : 'remove']('hidden');

            transitionDOM('thumbnail').querySelector('img')?.remove();
            let thumbnail = document.createElement("img");
            thumbnail.className = "img img-fill";
            thumbnail.src = data.image.src;
            thumbnail.alt = '';
            transitionDOM('thumbnail').appendChild(thumbnail);

            transitionDOM('year').querySelector('.project__transition-year-current').innerHTML = '';
            transitionDOM('year').querySelector('.project__transition-year-current').textContent = data.year;
            document.querySelector('.project__transition').classList.add('can-return');
        }
    }

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();
        document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');
        document.querySelector('.header__back').classList.add('on-scroller');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sc-post__hero',
                start: `top top`,
                end: `bottom bottom`,
                scrub: true,
                onEnter() {
                    document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');
                    document.querySelector('.header__back').classList.add('on-scroller');
                },
                onEnterBack() {
                    document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');
                    document.querySelector('.header__back').classList.add('on-scroller');
                },
                onLeave() {
                    document.querySelector('.header__menu-item.grid-1-1').classList.remove('on-scroller');
                    document.querySelector('.header__back').classList.remove('on-scroller');
                },
            }
        })

        requestAnimationFrame(() => {
            sessionStorage.setItem("currentProject", props.data.index);
            setUpPageTransition(props.data);
        })

        let scaleArray = ['.post__hero-title, .post__hero-year, .post__hero-cta'];
        if (window.innerWidth <= 991) {
            scaleArray.push('.post__hero-info', '.post__hero-bottom')
        }
        if (window.innerWidth > 767) {
            tl
                .to(scaleArray, { scale: .8, autoAlpha: .6, duration: 1, ease: 'power2.in' }, 0)
                .to('.post__hero-cover img', { scale: .8, duration: 1, ease: 'none' }, 0)
                .to('.post__hero-cover', { scale: 1.4,  autoAlpha: .5, duration: 1, ease: 'none' }, 0)
        }

        const scrollToContent = () => getLenis().scrollTo(document.getElementById('post-content'), { duration: 2.5 });

        if (window.innerWidth > 991) {
            document.querySelector('.post__hero').addEventListener('click', scrollToContent);
        }

        const mdxConvert = [
            { h2: 'heading h4 fw-med cl-txt-title' },
            { h3: 'heading h5 fw-med cl-txt-title' },
            { h4: 'heading h6 fw-med cl-txt-title' },
            { a: 'cl-txt-orange txt-link hover-un' },
            { img: 'img' }
        ]
        mdxConvert.forEach((item) => {
            const [selector, className] = Object.entries(item)[0];
            document.querySelectorAll(`.post__content-richtext ${selector}`).forEach(el => el.className += className);
        });
        document.querySelectorAll('.post__content-richtext img').forEach(el => {
            if (el.parentNode.tagName.toLowerCase() === 'p') {
                const figure = document.createElement('figure');
                el.parentNode.parentNode.replaceChild(figure, el.parentNode);
                figure.appendChild(el);

                if (el.title) {
                    const figcaption = document.createElement('figcaption');
                    figcaption.className = 'fs-16';
                    figcaption.textContent = el.title;
                    figure.appendChild(figcaption);
                }
            }
        })

        onCleanup(() => {
            tl.kill();
            if (window.innerWidth > 991) {
                document.querySelector('.post__hero').removeEventListener('click', scrollToContent);
            }
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default PostScript;