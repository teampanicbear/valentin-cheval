import Lenis from 'lenis';

let lenis;

function initLenis(options = {}) {
    lenis = new Lenis({
        infinite: window.innerWidth > 991 ? true : false,
        content: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper-inner'),
        wrapper: window.innerWidth > 767 ? document.documentElement : document.querySelector('.wrapper'),
        ...options
    });

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf);

    lenis.stop();

    return lenis;
}

function getLenis(options = {}) {
    if (!lenis) {
        initLenis(options);
    } else if (Object.keys(options).length > 0) {
        // Reinitialize Lenis if new options are provided
        initLenis(options);
    }
    return lenis;
}

let ticking = true;
function headerOnScroll(scrollPos) {
    const header = document.querySelector('header');
    if (!header) return;
    if (scrollPos > (header.offsetHeight * 6) && !header.classList.contains('on-scroll')) {
        header.classList.add("on-scroll");
    }
    else if (scrollPos <= (header.offsetHeight * 6) && header.classList.contains('on-scroll')) {
        header.classList.remove('on-scroll');
    }
    ticking = false;
}
function applyOnScroll(scrollPos) {
    headerOnScroll(scrollPos);
}

function reInitLenisScroll(_lenis, isProjectPage) {
    _lenis.on('scroll', function (inst) {
        // console.log(inst.velocity)
        let scrollPos = inst.scroll;
        if (!ticking) {
            requestAnimationFrame(() => {
                applyOnScroll(scrollPos);
            });
            ticking = true;
        }
    })

    setTimeout(() => {
        _lenis.start();
    }, isProjectPage ? 800 : 0);

    _lenis.scrollTo("top", {
        duration: .001,
    })
}

export { initLenis, getLenis, applyOnScroll, reInitLenisScroll }