import { chunkToString } from 'astro/runtime/server/render/common.js';
import { createSignal, onMount } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { cvUnit } from '~/utils/number';

const TOC = () => {
  const [headings, setHeadings] = createSignal([]);
  const [activeToc, setActiveToc] = createSignal(0);

  onMount(() => {
    let headingsDOM = document.querySelectorAll('.post__content-richtext-inner h2');

    setHeadings([...headingsDOM].map((heading) => ({ text: heading.textContent, id: heading.id })));

    getLenis().on('scroll', function (e) {
      let currScroll = e.scroll;

      for (let i = 0; i < headingsDOM.length; i++) {
        const top = headingsDOM[i].getBoundingClientRect().top;
        if (top > 0 && top < cvUnit(150, 'rem')) {
          setActiveToc(i);
        }
      }
    });

    if (
      document.querySelector('.post__content-toc-listing').scrollHeight >=
      document.querySelector('.post__content-toc-listing').offsetHeight
    ) {
      document.querySelector('.post__content-toc-listing').setAttribute('data-lenis-prevent', '');
    }
  });

  function activeScrollTo(id) {
    let el = document.querySelector(`[id="${id}"]`);
    getLenis().scrollTo(el, {
      offset: -cvUnit(150, 'rem'),
    });
  }

  return (
    <div class="post__content-toc-inner">
      <p className="fw-med cl-txt-desc post__content-toc-title" data-cursor-stick>
        Summary
      </p>
      <ul class="post__content-toc-listing">
        {headings().map((heading, idx) => (
          <li
            class={`fw-med cl-txt-disable post__content-toc-item${idx === activeToc() ? ' active' : ''}`}
            onClick={() => {
              activeScrollTo(heading.id);
              setActiveToc(idx);
            }}
            data-cursor="-link"
            data-cursor-stick={`.post__content-toc-item-point.toc-${idx}`}
          >
            <div class={`post__content-toc-item-point toc-${idx}`}></div>
            {heading.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TOC;
