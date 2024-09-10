import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { percentage } from '~/utils/number';
import { breakText } from '~/utils/text';

const PostScript = (props) => {
    let scriptRef;

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)
    const setUpPageTransition = () => {
        if (document.querySelector('.project__transition').classList.contains('can-return')) {
        }
        else {
            gsap.set(transitionDOM('name'), {
                y: document.querySelector('.post__hero-title').getBoundingClientRect().top,
                scale:
                    window.innerWidth <= 767 ? 1.1428571429 :
                    window.innerWidth <= 991 ? 1.4375 : 2,
                duration: 0
            })

            let infoPos = document.querySelector('.post__hero-info').getBoundingClientRect().left - transitionDOM('info').getBoundingClientRect().left;
            gsap.set(transitionDOM('info'), { x: infoPos, duration: 0 })
            gsap.set(transitionDOM('year'), { x: infoPos, duration: 0 })

            gsap.set(transitionDOM('thumbnail'), {
                width: '100%',
                height: percentage(
                    window.innerWidth <= 767 ? 67 :
                    window.innerWidth <= 991 ? 72 : 100, window.innerHeight),
                x: 0, y: 0
            })

            transitionDOM('name').innerHTML = breakText(props.data.headingTitle);
            props.data.roles.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub";
                p.textContent = title;
                transitionDOM('info-role').appendChild(p);
            });
            props.data.services.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub";
                p.textContent = title;
                transitionDOM('info-service').appendChild(p);
            });
            props.data.sellingPoints.forEach(({ title }) => {
                let p = document.createElement("p");
                p.className = "cl-txt-sub";
                p.textContent = title;
                transitionDOM('info-selling').appendChild(p);
            });

            let thumbnail = document.createElement("img");
            thumbnail.className = "img img-fill";
            thumbnail.src = props.data.image.src;
            thumbnail.alt = '';
            transitionDOM('thumbnail').appendChild(thumbnail);

            transitionDOM('year').querySelector('.project__transition-year-current').textContent = props.data.year;
            document.querySelector('.project__transition').classList.add('can-return');
        }
    }

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sc-post__hero',
                start: `top top`,
                end: `bottom bottom`,
                scrub: true
            }
        })

        sessionStorage.setItem("currentProject", props.data.index);
        setUpPageTransition();

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