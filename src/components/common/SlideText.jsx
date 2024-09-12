import { onCleanup, onMount } from "solid-js";
import gsap from 'gsap';
import SplitType from "split-type";

function SlideText(props) {
    let slideRef;
    let tlMaster;

    onMount(() => {
        if (!slideRef) return;
        tlMaster = gsap.timeline({paused: true});
        gsap.set(slideRef.querySelectorAll('.slide-txt-item'), { transformOrigin: props.rootOrigin ? 'center center -.1em !important' : 'center center -.26em !important'});
        slideRef.querySelectorAll('.slide-txt-item').forEach((text, idx) => {
            let dur = 3;
            let ease = 'expo.inOut'
            let transform = { out: 'translate3d(0px, 25.5961px, -26.0467px) rotateX(-91deg)', in: 'translate3d(0px, -25.5961px, -26.0468px) rotateX(91deg)' }
            if (idx == props.data.length - 1) {
                gsap.set(text, { transform: 'none', autoAlpha: 1 })
            } else {
                gsap.set(text, { transform: transform.out, autoAlpha: 0 })
            }
            let tlChild = gsap.timeline({repeat: -1});
            
            if (idx === props.data.length - 1) {
                tlChild
                    .set(text, { transform: 'none', autoAlpha: 1 })
                    .to(text, { transform: transform.in, autoAlpha: 0, duration: dur, ease: ease }, "<=0")
                    .to(text, { duration: dur * (idx) - (1 * dur)})

                    .set(text, { transform: transform.out, autoAlpha: 0})
                    .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease })
            } else {
                tlChild
                    .set(text, { transform: transform.out, autoAlpha: 0 })
                    .to(text, { duration: dur * idx}, "<=0")
                    .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease })
                    .to(text, { transform: transform.in, autoAlpha: 0, duration: dur, ease: ease })
                    .to(text, { duration: (props.data.length - 2 - idx) * dur})
            }
            tlMaster.add(tlChild, 0);
        })
        if (props.interaction) {
            // console.log(props.data.length)
            // slideRef.addEventListener('mouseenter', handleEnter);
            // slideRef.addEventListener('mouseleave', handleLeave);
            // slideRef.addEventListener('click', handleClick);
        }
        tlMaster.play()
    })
    let curIdx = 0;
    const handleClick = () => {
        console.log(tlMaster.progress())
        // tlMaster.pause()
        curIdx = curIdx + 1
        let curr = tlMaster.progress()
        let next = (1/6 * curIdx) - curr
        console.log(next)
        gsap.to(tlMaster, { progress: `${next}`, duration: tlMaster.totalDuration() / 3 * next, ease: 'linear', onComplete: () => {
            
        }})
    }
    const handleEnter = () => {
        tlMaster.pause()
        // tlMaster.play()
        // function update() {
        //     console.log(tlMaster.progress())
        //     requestAnimationFrame(update)
        // }
        // requestAnimationFrame(update)
    };
    const handleLeave = () => {
        // tlMaster.play()
    }
    return (
        <>
            <div
                class="grid-1-1 slide-txt-wrap"
                ref={slideRef}
                style={{ width: "max-content" }}
            >
            {props.data.map((text) => <div class={`slide-txt-item ${props.rootOrigin ? 'root-origin' : ''}`}>{text}</div>)}
            </div>
            <style jsx> {`
                .slide-txt-wrap {
                    perspective: 82.5rem;
                    overflow: hidden;
                }
                .slide-txt-item {
                    backface-visibility: hidden;
                    transform-origin: center center -.26em !important;
                }
                .slide-txt-item.root-origin {
                    transform-origin: center center -.1em !important;
                }
            `}</style>
        </>
    )
}

export default SlideText;
