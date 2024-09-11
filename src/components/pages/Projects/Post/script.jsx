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
            console.log("run")
            gsap.set(transitionDOM('name'), {
                y: document.querySelector('.post__hero-title').getBoundingClientRect().top,
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

            transitionDOM('thumbnail').innerHTML = '';
            let thumbnail = document.createElement("img");
            thumbnail.className = "img img-fill";
            thumbnail.src = data.image.src;
            thumbnail.alt = '';
            transitionDOM('thumbnail').appendChild(thumbnail);

            transitionDOM('year').querySelector('.project__transition-year-current').innerHTML = '';
            transitionDOM('year').querySelector('.project__transition-year-current').textContent = data.year;
            console.log("run")
            document.querySelector('.project__transition').classList.add('can-return');
        }
    }

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();
        document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sc-post__hero',
                start: `top top`,
                end: `bottom bottom`,
                scrub: true,
                onEnter() {
                    document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');
                },
                onEnterBack() {
                    document.querySelector('.header__menu-item.grid-1-1').classList.add('on-scroller');
                },
                onLeave() {
                    console.log("leave");
                    document.querySelector('.header__menu-item.grid-1-1').classList.remove('on-scroller');
                },
            }
        })

        requestAnimationFrame(() => {
            sessionStorage.setItem("currentProject", props.data.index);
            setUpPageTransition(props.data);
        })
        console.log(sessionStorage.getItem("currentProject"))

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

        const scrollToContent = () => getLenis().scrollTo(document.getElementById('post-content'));

        if (window.innerWidth > 991) {
            document.querySelector('.post__hero').addEventListener('click', scrollToContent);
        }

        document.querySelectorAll('.post__content-richtext h2').forEach(el => el.className += 'heading h4 fw-med cl-txt-title');
        document.querySelectorAll('.post__content-richtext h3').forEach(el => el.className += 'heading h5 fw-med cl-txt-title');
        document.querySelectorAll('.post__content-richtext h4').forEach(el => el.className += 'heading h6 fw-med cl-txt-title');
        document.querySelectorAll('.post__content-richtext a').forEach(el => el.className += 'cl-txt-orange txt-link hover-un');

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