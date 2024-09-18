import gsap from "gsap";
import SplitType from 'split-type';

export const gGetter = (property) => (el) => gsap.getProperty(el, property);
export const gSetter = (property, unit = '') => (el) => gsap.quickSetter(el, property, unit);

export const splitTextFadeUp = (className, types) => {
    const splitTextItem = new SplitType(className, { type: 'lines, words', lineClass: 'split-line unset-margin' });
    gsap.set(splitTextItem.words, { autoAlpha: 0, yPercent: 70 });
    gsap.set(className, { autoAlpha: 1 });

    return splitTextItem;
} 