import { chunkToString } from 'astro/runtime/server/render/common.js';
import { createSignal, onMount } from 'solid-js';
import { getLenis } from '~/components/core/lenis';
import { registeredEvents } from '~/components/core/swup';
import { cvUnit } from '~/utils/number';
import { checkOS, isSafari } from '~/utils/os';

const SocialShare = (props) => {
  onMount(() => {
    let allIcons = document.querySelectorAll('.post__content-share-item');
    let url = window.location.href;
    allIcons.forEach((icon) => {
      icon.setAttribute('target', '_blank');
      switch (icon.getAttribute('data-share')) {
        case 'linkedin':
          icon.setAttribute('href', `https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
          break;
        case 'facebook':
          icon.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${url}`);
          break;
        case 'twitter':
          icon.setAttribute('href', `https://twitter.com/intent/tweet?url=${url}`);
          break;
        case 'copy':
          break;
        default:
          break;
      }
    });
    const handleCopyClipboard = (e) => {
      e.preventDefault();
      copyTextToClipboard(url);
    };
    document.querySelector('[data-share="copy"]').addEventListener('click', handleCopyClipboard);
    registeredEvents.push({
      type: 'click',
      handler: handleCopyClipboard,
      element: document.querySelector('[data-share="copy"]'),
    });
  });
  function shareOnIos() {
    navigator
      .share({
        title: window.document.title,
        text:
          document.querySelector('meta[name="description"]').getAttribute('content') ||
          'Check out this project!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
  }
  function copyTextToClipboard(text) {
    if (isSafari() && checkOS().mobile && navigator.share) {
      shareOnIos();

      document.querySelector('.post__content-share-item-ic .ic-copy').classList.add('hidden');
      document.querySelector('.post__content-share-item-ic .ic-share').classList.remove('hidden');
      document.querySelector('[data-share="facebook"]').classList.add('hidden');
      document.querySelector('[data-share="linkedin"]').classList.add('hidden');
      document.querySelector('[data-share="twitter"]').classList.add('hidden');
    } else {
      let textArea = document.createElement('textarea');
      textArea.style.display = 'none';
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch((error) => {
          console.error('Failed to copy text to clipboard:', error);
        });
      document.body.removeChild(textArea);

      document.querySelector('.post__content-share-item-txt').classList.add('active');
      setTimeout(() => {
        document.querySelector('.post__content-share-item-txt').classList.remove('active');
      }, 3000);
    }
  }

  return (
    <div class="post__content-share-inner">
      <a href="#" data-share="linkedin" class="post__content-share-item" data-cursor="-hidden">
        <div class="post__content-share-item-ic">
          <div class="ic ic-20">{props.linkedin}</div>
        </div>
      </a>
      <a href="#" data-share="facebook" class="post__content-share-item" data-cursor="-hidden">
        <div class="post__content-share-item-ic">
          <div class="ic ic-24">{props.facebook}</div>
        </div>
      </a>
      <a href="#" data-share="twitter" class="post__content-share-item" data-cursor="-hidden">
        <div class="post__content-share-item-ic">
          <div class="ic ic-20">{props.twitter}</div>
        </div>
      </a>
      <a href="#" data-share="copy" class="post__content-share-item" data-cursor="-hidden">
        <div class="post__content-share-item-ic">
          <div class="ic ic-20 ic-copy">{props.copy}</div>
          <div class="ic ic-20 ic-share hidden">{props.share}</div>
        </div>
        <div className="post__content-share-item-txt">Copied!</div>
      </a>
    </div>
  );
};

export default SocialShare;
