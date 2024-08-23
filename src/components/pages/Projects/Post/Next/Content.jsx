import gsap from "gsap";
import { onCleanup, onMount } from "solid-js";
import { getLenis } from "~/components/core/lenis";

function Content(props) {
    const pageTransition = () => {
        document.querySelector('.sc__next-post.fake .next__post-title .current').innerHTML = document.querySelector('.sc__next-post.default .next__post-title').innerHTML;
        document.querySelector('.sc__next-post.fake .next__post-title .next').innerHTML = document.querySelector('.sc__next-post.default .next__post-title').innerHTML;
        document.querySelector('.sc__next-post.fake .next__post-img-inner').innerHTML = document.querySelector('.sc__next-post.default .next__post-img-inner').innerHTML;

        let rect = document.querySelector('.sc__next-post.default').getBoundingClientRect();
        // gsap.set('.sc__next-post.fake .next__post', { top: rect.top, height: rect.height, transformOrigin: 'top left' })
        let title = {
            from: document.querySelector('.sc__next-post.fake .next__post-title .current'),
            to: document.querySelector('.sc__next-post.fake .next__post-title .next')
        }

        requestAnimationFrame(() => {
            gsap.timeline({
                defaults: { ease: 'expo.inOut', duration: 1.2 },
                onStart() {
                    getLenis().stop();
                },
                onComplete() {
                    getLenis().start();
                    document.querySelector('.sc__next-post.fake .next__post-title .current').innerHTML = '';
                    document.querySelector('.sc__next-post.fake .next__post-title .next').innerHTML = '';
                    document.querySelector('.sc__next-post.fake .next__post-img-inner').innerHTML = '';
                    document.querySelector('.sc__next-post.fake .next__post').removeAttribute('style');
                    document.querySelector('.sc__next-post.fake .next__post-title .current').removeAttribute('style');
                }
            })
            .set('.sc__next-post.fake', { zIndex: 5, duration: 0 })
            .fromTo('.sc__next-post.fake .next__post',
                { top: rect.top, height: rect.height },
                { top: 0, height: window.innerHeight }, "<=0")
            .fromTo('.sc__next-post.fake .next__post-img-inner',
                { opacity: window.innerWidth > 991 ? .1 : .3, scale: window.innerWidth > 991 ? 1.2 : 1 }, { opacity: 1, scale: 1 }
                , "<=0")
            .fromTo(title.from,
                { y: 0 }, { y: -(title.from.getBoundingClientRect().top - title.to.getBoundingClientRect().top) }
                , "<=0")
            .to('.sc__next-post.fake', { autoAlpha: 0, ease: 'linear', duration: 0.4, clearProps: 'all' })
        })
    }
    onMount(() => {

    })
    return (
        <a href={`/${props.link}`} onClick={pageTransition} style={{ 'height': '100%', 'width': '100%' }}>
            {props.children}
        </a>
    )
}
export default Content;