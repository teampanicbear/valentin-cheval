import SlideText from '~/components/common/SlideText';
import TextTransClip from '~/components/common/TextTransClip';
import { cvUnit } from '~/utils/number';

const HistoryHead = (props) => {
    const LINE_HEIGHT_HEADING = 160 * 0.835;
    const calcHeadingTop = (idx) => cvUnit(160 + (LINE_HEIGHT_HEADING * idx), 'rem');
    const triggerOpts = (idx) => {
        return ({
            trigger: '.sc-about__history',
            start: `top+=${calcHeadingTop(idx)} bottom`,
            end: `top+=${calcHeadingTop(idx + 1)} top+=${(window.innerHeight / 2) + LINE_HEIGHT_HEADING}`
        })
    }
    return (
        <>
            <h2 class="upper fix-font about__history-title grid">
                <span class="heading h2 fw-bold about__history-title-txt">I have</span>
                <span class="heading h2 fw-bold cl-txt-orange about__history-title-txt">{Number(props.currentYear) - 16} years</span>
                <span class="heading h2 fw-bold about__history-title-txt">of Experience</span>
                <span class="heading h2 fw-bold about__history-title-txt">in <span class="cl-txt-title inline-block">
                    <SlideText data={props.slideText} client:visible={{ rootMargin: "100% 0% 100% 0%" }}/>
                </span></span>
                <span class="heading h2 fw-bold about__history-title-txt">field</span>
            </h2>
            <h2 class="upper fix-font about__history-title mod-mb grid">
                <span class="heading h2 fw-bold about__history-title-txt">I have</span>
                <span class="heading h2 fw-bold about__history-title-txt"><span class="cl-txt-orange">8 years</span> of</span>
                <span class="heading h2 fw-bold about__history-title-txt">Experience</span>
                <span class="heading h2 fw-bold about__history-title-txt">in <span class="cl-txt-title inline-block">
                    <SlideText data={props.slideText} client:visible={{ rootMargin: "100% 0% 100% 0%" }}/>
                </span></span>
                <span class="heading h2 fw-bold about__history-title-txt">field</span>
            </h2>
        </>

    )
}

export default HistoryHead;