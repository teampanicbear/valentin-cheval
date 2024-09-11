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
            if (idx == 0) {
                gsap.set(text, { transform: 'none', autoAlpha: 1 })
            } else {
                gsap.set(text, { transform: 'translate3d(0px, 25.5961px, -26.0467px) rotateX(-91deg)', autoAlpha: 0 })
            }
            let yPercent = { out: 'translate3d(0px, 25.5961px, -26.0467px) rotateX(-91deg)', in: 'translate3d(0px, -25.5961px, -26.0468px) rotateX(91deg)' }
            let tlChild = gsap.timeline({ repeat: -1 });
            if (idx === props.data.length - 1) {
                tlChild
                    .set(text, { transform: 'none', autoAlpha: 1 })
                    .to(text, { transform: yPercent.in, autoAlpha: 0, duration: dur, ease: ease }, "<=0")
                    .to(text, { duration: dur * (idx) - (1 * dur)})

                    .set(text, { transform: yPercent.out, autoAlpha: 0})
                    .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease })
            }
            else {
                tlChild
                    .set(text, { transform: yPercent.out, autoAlpha: 0 })
                    .to(text, { duration: dur * idx}, "<=0")
                    .to(text, { transform: 'none', autoAlpha: 1, duration: dur, ease: ease })
                    .to(text, { transform: yPercent.in, autoAlpha: 0, duration: dur, ease: ease })
                    .to(text, { duration: (props.data.length - 2 - idx) * dur})
            }
            tlMaster.add(tlChild, 0);
        })
        tlMaster.play()
    })
    const handleEnter = () => tlArr.forEach(el => el.pause());
    const handleLeave = () => tlArr.forEach(el => el.resume());
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
