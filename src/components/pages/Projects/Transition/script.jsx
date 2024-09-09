import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';

const TransitionScript = () => {
    let scriptRef;

    const transitionDOM = (attr) => document.querySelector(`.project__transition [data-project-${attr}]`)

    const transitionBack = () => {
        let tl = gsap.timeline({
            defaults: { ease: 'expo.inOut', duration: 1.2 }
        })


        const getBoundingTransition = (attr) => {
            let from = transitionDOM(attr).getBoundingClientRect();
            let to = document.querySelector(`.projects__position-${attr}`).getBoundingClientRect();
            return { from, to };
        }

        if (document.querySelector('.project__transition').classList.contains('can-return')) {
            tl.to(transitionDOM('name'), {
                // { y: 0, paddingTop:  }
            })
        }
    }

    onMount(() => {
        document.querySelectorAll('[is-projects-link]').forEach((el) => {
            console.log(el)
            el.addEventListener("click", (e) => {

            })
        })
        onCleanup(() => {
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default TransitionScript;