import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { cvUnit } from '~/utils/number';

const LoaderScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        let isLoaded = sessionStorage.getItem("isLoaded") == 'true' ? true : false;

        initScrollTrigger();        

        console.log('load loader')
        let hypot, angle;
        function updateOnResize() {
            hypot = Math.hypot(window.innerWidth, window.innerHeight);
            angle = (Math.atan2(window.innerHeight, window.innerWidth) * 180) / Math.PI
            gsap.set('.loader-wrap', {'--hypot': `${hypot}px`, '--angle': `${angle}deg`});
        }
        window.addEventListener('resize', updateOnResize);
        updateOnResize();
        document.querySelector('.loader-wrap').classList.add('on-ready');
        let tlLoad = gsap.timeline({
            paused: true,
            onComplete: () => {
                sessionStorage.getItem("isLoaded") == 'true' ? null : sessionStorage.setItem("isLoaded", 'true')
            }
        })
        if (!isLoaded) {
            document.querySelector('.home__hero-greating-wrap').classList.add('on-ready');
            tlLoad
            .to('.loader-wrap', {'--prog': 1, duration: 2, onComplete: () => {
                document.querySelector('.loader-cross').classList.add('on-done');
            }})
            let tlLoadMaster = gsap.timeline({
                delay: .3
            });
            tlLoadMaster
            .to(tlLoad, {progress: .12, duration: 1.2, ease: "power2.easeInOut"})
            .to(tlLoad, {progress: .65, duration: 1, ease: "power2.easeInOut"})
            .to(tlLoad, {progress: 1, duration: .6, ease: "power2.easeInOut", onComplete: () => {
                gsap.to('.loader-wrap', {'--offset': `${hypot / 2}px`, duration: 2, ease: 'power2.inOut'})
            }})
        } else {
            document.querySelector('.loader-cross').classList.add('on-done');
            tlLoad
            .to('.loader-wrap', {delay: .3, '--offset': `${hypot / 2}px`, duration: 2, ease: 'power2.inOut'})
            tlLoad.play();
        }
        
        onCleanup(() => {
            
        });
    })

    return (<div ref={scriptRef} class="divScript"></div>)
}

export default LoaderScript;