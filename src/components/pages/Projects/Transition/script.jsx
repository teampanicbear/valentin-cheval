import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';

const TransitionScript = () => {
    let scriptRef;

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

    const transitionBack = () => {
        let tl = gsap.timeline({
            onStart() {
                document.querySelector('.project__transition').classList.add('is-returning');
            },
            defaults: { ease: 'expo.inOut', duration: 1.2 }
        })

        const getBoundingTransition = (attr) => {
            let from = transitionDOM(attr).getBoundingClientRect();
            let to = document.querySelector(`.projects__position-${attr}`).getBoundingClientRect();
            return { from, to };
        }

        if (document.querySelector('.project__transition').classList.contains('can-return')) {
            let thumbRect = document.querySelector('.project__transition-thumbnail-area').getBoundingClientRect();
            gsap.set('.project__transition', { autoAlpha: 1, duration: 0 });
            tl
                .to(transitionDOM('name'), {
                    y: window.getComputedStyle(transitionDOM('name')).getPropertyValue('--oTop'),
                    scale: 1
                })
                .to(transitionDOM('thumbnail'), {
                    width: thumbRect.width, height: thumbRect.height, x: thumbRect.left, y: thumbRect.top,
                }, "<=0")
                .to('.project__transition', { autoAlpha: 0, ease: 'linear', duration: 0.4 })
            if (window.innerWidth > 991) {
                tl
                    .to(transitionDOM('info'), { x: 0 }, 0)
                    .to(transitionDOM('year'), { x: 0, lineHeight: '.9em' }, 0)
            }
        }
    }

    onMount(() => {
        document.querySelectorAll('[is-projects-link]').forEach((el) => {
            el.addEventListener("click", (e) => {
                transitionBack();
            })
        })

        const transformName = window.getComputedStyle(transitionDOM('name')).getPropertyValue('transform');
        gsap.set(transitionDOM('name'), { '--oTop': new DOMMatrix(transformName).m42 });
        gsap.set(transitionDOM('name'), { '--oTop': new DOMMatrix(transformName).m42 });

        const transformInfo = window.getComputedStyle(transitionDOM('info')).getPropertyValue('transform');
        gsap.set(transitionDOM('info'), { '--oLeft': new DOMMatrix(transformName).m41 });

        onCleanup(() => {
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default TransitionScript;