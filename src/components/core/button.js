import gsap from 'gsap';
import { easeInOutQuint } from '~/utils/easing';

const initButton = (state) => {
    if (state === 'render') {
        document.querySelectorAll("[data-magnetic]").forEach(function (el) {
            el.classList.add("magnt");
            if (el.classList.contains("magnt")) {
                el.addEventListener("mousemove", function (e) {
                    let r = .4;
                    let rect = el.getBoundingClientRect(),
                    xTarget = e.pageX - rect.left,
                    // yTarget = e.pageY - rect.top,
                    // topPos = window.pageYOffset || document.documentElement.scrollTop;
                    gsap.to(el, { x: (xTarget - rect.width / 2) * r, y: (yTarget - rect.height / 2 - topPos) * r, ease: "power2", duration: 0.6 });
                })
                el.addEventListener("mouseleave", function () {
                    gsap.to(el, { scale: 1, x: 0, y: 0, ease: "power3", duration: 0.8 });
                });
            }
        });
    }
}

export default initButton;