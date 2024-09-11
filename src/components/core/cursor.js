import gsap from 'gsap';
import MouseFollower from "mouse-follower";
import { gGetter, gSetter } from '~/utils/gsap';

const xGetter = gGetter('x');
const yGetter = gGetter('y');
const opacityGetter = gGetter('opacity');

const xSetter = gSetter('x', 'px');
const ySetter = gSetter('y', 'px');
const opacitySetter = gSetter('opacity');

MouseFollower.registerGSAP(gsap);
let cursor;

function initMouseFollower() {
    cursor = new MouseFollower({
        speed: 0.7,
        // ease: 'linear',
        skewing: 0,
        skewingText: 0.5,
        skewingIcon: 0.5,
        skewingMedia: 0.5,
        stickDelta: 0,
    })
}

function getCursor() {
    if (!cursor) {
        if (window.innerWidth > 991) {
            initMouseFollower();
        }
    }
    return {
        follower: cursor,
        x: xGetter('.mf-cursor'),
        y: yGetter('.mf-cursor'),
        xNorCenter: (xGetter('.mf-cursor') / window.innerWidth - 0.5) * 2,
        yNorCenter: (yGetter('.mf-cursor') / window.innerHeight - 0.5) * 2,
    }
}

export { initMouseFollower, getCursor }