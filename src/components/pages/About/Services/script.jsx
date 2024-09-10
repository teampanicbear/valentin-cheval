import gsap from 'gsap';
import { onMount, onCleanup } from 'solid-js';
import { initScrollTrigger } from '~/components/core/scrollTrigger';

const ServicesScript = () => {
    let scriptRef;

    onMount(() => {
        if (!scriptRef) return;
        initScrollTrigger();

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about__daily',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        })
        tl
        .fromTo('.about__daily-img-inner img',
            { yPercent: -20 },
            { yPercent: 5, duration: 1, ease: 'linear' }
        )
        // .fromTo('.about__daily-content',
        //     { yPercent: 20 },
        //     { yPercent: 0, duration: 1, ease: 'linear' }
        // , 0);

        // let tlOverlap = gsap.timeline({
        //     scrollTrigger: {
        //         trigger: '.about__daily',
        //         start: `bottom bottom`,
        //         end: `bottom top`,
        //         scrub: true
        //     }
        // })

        // tlOverlap
        //     .to('.about__daily-img img', { scale: .8, transformOrigin: 'bottom', duration: 1, ease: 'linear' })
        //     .to('.about__daily-img', { scale: 1.4, transformOrigin: 'bottom', duration: 1, ease: 'linear' }, 0)
        //     .to('.about__daily', { autoAlpha: 0, duration: 1, ease: 'linear' }, 0)
        //     .to('.about__daily-content', { yPercent: -30, duration: 1, ease: 'linear' }, 0)

        const serviceItems = document.querySelectorAll('.about__service-item');
        const handleToggle = (e) => {
            const el = e.currentTarget;
            const content = el.querySelector('.about__service-item-desc');

            requestAnimationFrame(() => {
                if (el.classList.contains('active')) {
                gsap.to(content, {
                    height: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onStart() {
                    el.classList.remove('active');
                    }
                });
            } else {
                gsap.timeline()
                    .to('.about__service-item.active .about__service-item-desc', {
                        height: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onStart() {
                        document.querySelectorAll('.about__service-item.active').forEach(item => {
                            item.classList.remove('active');
                        });
                        el.classList.add('active');
                        }
                    })
                    .to(content, {
                        height: content.scrollHeight,
                        duration: 0.5,
                        ease: 'power2.inOut'
                    }, "<=.1");
            }});
        };

        if (window.innerWidth <= 991) {
            serviceItems.forEach(el => {
                el.addEventListener('click', handleToggle);
            });
        }
        onCleanup(() => {
            tl.kill();
            serviceItems.forEach(el => {
                el.removeEventListener('click', handleToggle);
            });
        });
    })

    return <div ref={scriptRef} class="divScript"></div>
}
export default ServicesScript;