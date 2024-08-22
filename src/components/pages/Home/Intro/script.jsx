import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { getCursor } from '~/components/core/cursor';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { gGetter, gSetter } from '~/utils/gsap';
import { inView, lerp } from '~/utils/number';

const IntroScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;

        initScrollTrigger();
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.home__intro-awards-listing',
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: true
            }
        });

        tl.to('.home__intro-award', { '--scale-factor': '1', duration: 1, stagger: .03 })

        // let reqID;

        // const xGetter = gGetter('x');
        // const yGetter = gGetter('y');
        // const xSetter = gSetter('x', 'px');
        // const ySetter = gSetter('y', 'px');


        // let target = document.querySelectorAll('.home__intro-award-logo');
        // let allItems = document.querySelectorAll('.home__intro-award')
        // let wrap = document.querySelector('.home__intro-awards');

        // let rect = wrap.getBoundingClientRect();
        // const maxYMove = wrap.offsetHeight / 2;

        // // const logoMove = () => {
        // //     const init = () => {
        // //         target.forEach((el) => {
        // //             let yMove = getCursor().y - (el.getBoundingClientRect().top - maxYMove);
        // //             let limitBorderYMove = Math.max(Math.min(yMove, maxYMove), -maxYMove) / 2;

        // //             ySetter(el)(lerp(yGetter(target[0]), limitBorderYMove, .55));
        // //         })
        // //     }
        // //     if (inView(wrap)) {
        // //         init();
        // //     }
        // //     reqID = requestAnimationFrame(logoMove);
        // // }
        // // reqID = requestAnimationFrame(logoMove)

        onCleanup(() => tl.kill());
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;