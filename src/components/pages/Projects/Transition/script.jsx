import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { percentage } from '~/utils/number';

const TransitionScript = () => {
    let scriptRef;

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

    const transitionBack = (originPosition) => {
        let tl = gsap.timeline({
            onStart() {
                document.querySelector('.project__transition').classList.add('is-returning');
            },
            onComplete() {
                document.querySelector('.project__transition').classList.remove('is-returning');
            },
            defaults: { ease: 'expo.inOut', duration: 1.2 }
        })

        if (document.querySelector('.project__transition').classList.contains('can-return')) {
            let thumbRect = document.querySelector('.project__transition-thumbnail-area').getBoundingClientRect();
            gsap.set('.project__transition', { autoAlpha: 1, duration: 0 });
            tl
                .to(transitionDOM('name'), { y: originPosition.name.top, scale: 1 })
                .to(transitionDOM('thumbnail'), { width: thumbRect.width, height: thumbRect.height, x: thumbRect.left, y: thumbRect.top }, "<=0")
                .to('.project__transition', { autoAlpha: 0, ease: 'linear', duration: 0.4 })
            if (window.innerWidth > 991) {
                tl
                    .to(transitionDOM('info'), { x: 0 }, 0)
                    .to(transitionDOM('year'), { x: 0 }, 0)
            }
        }
    }

    onMount(() => {
        let originPosition = {
            name: transitionDOM('name').getBoundingClientRect(),
            info: transitionDOM('info').getBoundingClientRect()
        }
        document.querySelectorAll('[is-projects-link]').forEach((el) => {
            el.addEventListener("click", (e) => {
                transitionBack(originPosition);
            })
        })
        onCleanup(() => {
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default TransitionScript;