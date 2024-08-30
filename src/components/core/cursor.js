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
        y: yGetter('.mf-cursor')
    }
}

function createGlow() {
    document.querySelectorAll('[data-border-glow]').forEach((el) => {
        const option = JSON.parse(el.dataset.glowOption);
        let outerBorder = el.querySelector('.border-outer');
        let innerBorder = el.querySelector('.border-inner');
        let lineBorder = el.querySelector('.glow-el');

        if (option.inset) {
            let widthStyle = '';
            let heightStyle = '';

            if (!option.inset.x && !option.inset.y) {
                widthStyle = `calc(100% - ${parseFloat(option.inset)}px)`;
                heightStyle = `calc(100% - ${parseFloat(option.inset)}px)`;
            } else {
                widthStyle = option.inset.x ? `calc(100% - ${parseFloat(option.inset.x)}px)` : '';
                heightStyle = option.inset.y ? `calc(100% - ${parseFloat(option.inset.y)}px)` : '';
            }
            gsap.set(outerBorder, { width: widthStyle, height: heightStyle });
        }

        gsap.set(outerBorder, {
            '--border-width': option.width || '1px',
            '--opacity': option.opacity || '1',
            '--glow': `${option.glow || '4'}rem`,
            '--bg-cl': option.color || "rgba(255, 255, 255, 1)"
        })

        // Set Glow for Glow Dot
        if (option.glow > 10) {
            lineBorder.classList.add('glow-big');
        } else if (option.glow > 6) {
            lineBorder.classList.add('glow-nor')
        } else {
            // No additional class needed for default glow
        }

        if (option.position) {
            lineBorder.classList.add('force-cl');
        }
    })
}

export { initMouseFollower, getCursor, createGlow }