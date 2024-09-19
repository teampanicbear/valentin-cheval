import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { splitTextFadeUp } from '~/utils/gsap';
import { ScrollOption } from '~/utils/helper';

const HistoryScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger(); 
        const btnHistory = document.querySelector('.about__history-link-inner');
        const decsHistorys = document.querySelectorAll('.about__history-sb');
        const lines = document.querySelectorAll('.about__history .line') 

        gsap.set(lines, {scaleX: 0, transformOrigin: 'left', duration: 0 })
        gsap.set(btnHistory, { autoAlpha: 0, yPercent: 70 });
        decsHistorys.forEach((el) => { 
             const decsSpliting = splitTextFadeUp(el);
            gsap.to(decsSpliting.words, {
                autoAlpha: 1, yPercent: 0, duration: 1.2, stagger: .02,ease: 'power2.out',
                ...ScrollOption(el,  ),
                onComplete: () => {
                    decsSpliting.revert();
                    el.removeAttribute('style');
                }
            })
        }) 
        
        lines.forEach(line => gsap.to(line, {
            scaleX: 1, transformOrigin: 'left', duration: 1.2, 
            ...ScrollOption(line,  )
         }))
        gsap.to(btnHistory, { autoAlpha: 1, yPercent: 0,delay: 0.2, duration: 1.2,ease: 'power2.out', ...ScrollOption(btnHistory )})
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default HistoryScript;