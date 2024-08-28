import gsap from 'gsap';
import MouseFollower from "mouse-follower";
import { lerp, inView, cvUnit } from "~/utils/number";
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
        stickDelta: 0
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

function borderGlow() {
    const createGlow = () => {
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

    const moveGlow = () => {
        let target = document.querySelectorAll('[data-border-glow]');
        gsap.set(".border-inner", { opacity: 0 });

        function initDotGlow() {
            let targetPos = {
                x: xGetter('.mf-cursor'),
                y: yGetter('.mf-cursor')
            };

            target.forEach((el, idx) => {
                let isGetData = false;
                let option;
                let borderTarget;
                let glowOuter;
                let glowInner;

                if (!isGetData) {
                    option = JSON.parse(el.getAttribute('data-glow-option'));
                    borderTarget = el.querySelector(".border-inner");
                    isGetData = true;
                }

                let xBorderTarget = xGetter(borderTarget);
                let yBorderTarget = yGetter(borderTarget);

                // Move with Cursor
                const MagicMath = () => {
                    // Calculate Glow Dot Move
                    const maxXMove = el.offsetWidth / 2;
                    const maxYMove = el.offsetHeight / 2;

                    let xMove = targetPos.x - (el.getBoundingClientRect().left + el.offsetWidth / 2);
                    let yMove = targetPos.y - (el.getBoundingClientRect().top + el.offsetHeight / 2);

                    let limitBorderXMove = Math.max(Math.min(xMove, maxXMove), -maxXMove);
                    let limitBorderYMove = Math.max(Math.min(yMove, maxYMove), -maxYMove);

                    // Calculate Magnetic Area
                    let boundingMagnet = {
                        top: el.getBoundingClientRect().top - cvUnit(option.magnetic * 10 / 2 || 0, "rem"),
                        right: el.getBoundingClientRect().right + cvUnit(option.magnetic * 10 / 2 || 0, "rem"),
                        bottom: el.getBoundingClientRect().bottom + cvUnit(option.magnetic * 10 / 2 || 0, "rem"),
                        left: el.getBoundingClientRect().left - cvUnit(option.magnetic * 10 / 2 || 0, "rem"),
                    };

                    const changeOpacityTarget = [borderTarget];

                    if (glowOuter) {
                        changeOpacityTarget.push(glowOuter);
                        changeOpacityTarget.push(glowInner);
                    }

                    // Anim opacity
                    const changeOpacity = {
                        change: () => {
                            let opacityTarget = opacityGetter(borderTarget);

                            if (borderTarget.classList.contains('active')) {
                                let xOffset = Math.abs(xMove) - maxXMove;
                                let yOffset = Math.abs(yMove) - maxYMove;

                                let xNormalize = Math.min(Math.abs((Math.abs(xMove) - el.offsetWidth / 2) / cvUnit(option.magnetic * 10 / 2 || 1, "rem") - 1), 1); // Run 0 - 1
                                let yNormalize = Math.min(Math.abs((Math.abs(yMove) - el.offsetHeight / 2) / cvUnit(option.magnetic * 10 / 2 || 1, "rem") - 1), 1); // Run 0 - 1

                                if (xOffset > 0 && yOffset > 0) {
                                    if (xOffset <= yOffset) {
                                        // Opacity Set by Y Pos
                                        changeOpacityTarget.forEach(target => {
                                            opacitySetter(target)(lerp(opacityTarget, yNormalize * 1.15, .95));
                                        });
                                    } else {
                                        // Opacity Set by X Pos
                                        changeOpacityTarget.forEach(target => {
                                            opacitySetter(target)(lerp(opacityTarget, xNormalize * 1.15, .95));
                                        });
                                    }
                                } else {
                                    if (xOffset <= 0) {
                                        // Opacity Set by Y Pos
                                        changeOpacityTarget.forEach(target => {
                                            opacitySetter(target)(lerp(opacityTarget, yNormalize * 1.15, .95));
                                        });
                                    }
                                    if (yOffset <= 0) {
                                        // Opacity Set by X Pos
                                        changeOpacityTarget.forEach(target => {
                                            opacitySetter(target)(lerp(opacityTarget, xNormalize * 1.15, .95));
                                        });
                                    }
                                    if (xOffset <= 0 && yOffset <= 0) {
                                        // This is Hovering
                                        changeOpacityTarget.forEach(target => {
                                            opacitySetter(target)(lerp(opacityTarget, 1, .95));
                                        });
                                    }
                                }
                            }
                        },
                        default: () => {
                            gsap.set(changeOpacityTarget, { opacity: 0 });
                        },
                        visible: () => {
                            gsap.set(changeOpacityTarget, { opacity: 1 });
                        }
                    };

                    // Check target in magnetic area yet
                    if (!option.position) {
                        if (boundingMagnet.left <= targetPos.x && targetPos.x <= boundingMagnet.right && boundingMagnet.top <= targetPos.y && targetPos.y <= boundingMagnet.bottom) {
                            // Anim Border
                            borderTarget.classList.add('active');
                            xSetter(borderTarget)(lerp(xBorderTarget, limitBorderXMove, .55));
                            ySetter(borderTarget)(lerp(yBorderTarget, limitBorderYMove, .55));

                            changeOpacity.change();
                        } else {
                            // Reset Border and Glow Position
                            borderTarget.classList.remove('active');
                            xSetter(borderTarget)(lerp(xBorderTarget, limitBorderXMove, .55));
                            ySetter(borderTarget)(lerp(yBorderTarget, limitBorderYMove, .55));

                            changeOpacity.default();
                        }
                    }

                    /// Check State Position of this border
                    if (option.position) {
                        if (boundingMagnet.left <= targetPos.x && targetPos.x <= boundingMagnet.right && boundingMagnet.top <= targetPos.y && targetPos.y <= boundingMagnet.bottom) {
                            // Anim
                            xSetter(borderTarget)(lerp(xBorderTarget, limitBorderXMove, .1));
                            ySetter(borderTarget)(lerp(yBorderTarget, limitBorderYMove, .1));

                            changeOpacity.visible();
                        } else {
                            // Reset Border and Glow Position
                            changeOpacity.visible();
                            xSetter(borderTarget)(lerp(xBorderTarget, 0, .05));
                            ySetter(borderTarget)(lerp(yBorderTarget, 0, .05));

                            // Check State Position of this border
                            const pos = option.position.split(" ");
                            pos.forEach(posTarget => {
                                switch (posTarget) {
                                    case 'top': ySetter(borderTarget)(lerp(yBorderTarget, -maxYMove, .05)); break;
                                    case 'bottom': ySetter(borderTarget)(lerp(yBorderTarget, maxYMove, .05)); break;
                                    case 'left': xSetter(borderTarget)(lerp(xBorderTarget, -maxXMove, .05)); break;
                                    case 'right': xSetter(borderTarget)(lerp(xBorderTarget, maxXMove, .05)); break;
                                }
                            });
                        }
                    }
                };

                if (inView(el)) {
                    MagicMath();
                }
            });

            requestAnimationFrame(initDotGlow);
        }
        requestAnimationFrame(initDotGlow);
    };

    createGlow()
    // moveGlow()
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