import gsap from "gsap";

export const gGetter = (property) => (el) => gsap.getProperty(el, property);
export const gSetter = (property, unit = '') => (el) => gsap.quickSetter(el, property, unit);
