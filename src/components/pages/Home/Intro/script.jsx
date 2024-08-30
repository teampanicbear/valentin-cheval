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

        let reqID;
        const xGetter = gGetter('x');
        const yGetter = gGetter('y');
        const xSetter = gSetter('x', 'px');
        const ySetter = gSetter('y', 'px');

        let target = document.querySelectorAll('.home__intro-award-logo');
        let wrap = document.querySelector('.home__intro-awards-wrap');

        const logoMove = () => {
            if (inView(wrap)) {
                target.forEach((el) => {
                    let yMove;
                    if (document.querySelectorAll('.home__intro-awards:hover').length) {
                        yMove = getCursor().y - wrap.getBoundingClientRect().top - el.getBoundingClientRect().height / 2;
                    } else {
                        yMove = yGetter(target[0])
                    }
                    ySetter(el)(lerp(yGetter(target[0]), yMove, .1));
                })
            }
            reqID = requestAnimationFrame(logoMove);
        }
        if (reqID == undefined) {reqID = requestAnimationFrame(logoMove)}

        onCleanup(() => {
            console.log('cleanup')
            cancelAnimationFrame(reqID);
            tl.kill()
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default IntroScript;