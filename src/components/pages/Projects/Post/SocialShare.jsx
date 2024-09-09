import { chunkToString } from "astro/runtime/server/render/common.js";
import { createSignal, onMount } from "solid-js"
import { getLenis } from "~/components/core/lenis";
import { cvUnit } from "~/utils/number";


const SocialShare = (props) => {
    onMount(() => {
        let allIcons = document.querySelectorAll('.post__content-share-item');
        let url = window.location.href;
        allIcons.forEach((icon) => {
            icon.setAttribute('target', '_blank');
            switch (icon.getAttribute('data-share')) {
                case 'linkedin':
                    icon.setAttribute('href', `https://www.linkedin.com/sharing/share-offsite/?url=${url}`)
                    break;
                case 'facebook':
                    icon.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${url}`)
                    break;
                case 'twitter':
                    icon.setAttribute('href', `https://twitter.com/intent/tweet?url=${url}`)
                    break;
                case 'copy':
                    break;
                default:
                    break;
            }
        })
        document.querySelector('[data-share="copy"]').addEventListener('click', function(e) {
            e.preventDefault();
            copyTextToClipboard(url)
            document.querySelector('.post__content-share-item-txt').classList.add('active');
            setTimeout(() => {
                document.querySelector('.post__content-share-item-txt').classList.remove('active');
            }, 3000)
        })
    })
    function copyTextToClipboard(text) {
        let textArea = document.createElement("textarea");
        textArea.style.display = 'none';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        navigator.clipboard.writeText(text)
            .then(() => {
            console.log('Text copied to clipboard');
            })
            .catch((error) => {
            console.error('Failed to copy text to clipboard:', error);
            });
        document.body.removeChild(textArea);
    }

    return (
        <div class="post__content-share-inner">
            <a href="#" data-share="linkedin" class="post__content-share-item" data-cursor="-social" data-cursor-stick>
                <div class="post__content-share-item-ic">
                    <div class="ic ic-20">
                        {props.linkedin}
                    </div>
                </div>
            </a>
            <a href="#" data-share="facebook" class="post__content-share-item" data-cursor="-social" data-cursor-stick>
            <div class="post__content-share-item-ic">
                    <div class="ic ic-24">
                        {props.facebook}
                    </div>
                </div>
            </a>
            <a href="#" data-share="twitter" class="post__content-share-item" data-cursor="-social" data-cursor-stick>
                <div class="post__content-share-item-ic">
                    <div class="ic ic-20">
                        {props.twitter}
                    </div>
                </div>
            </a>
            <a href="#" data-share="copy" class="post__content-share-item" data-cursor="-social" data-cursor-stick>
                <div class="post__content-share-item-ic">
                    <div class="ic ic-20">
                        {props.copy}
                    </div>
                </div>
                <div className="post__content-share-item-txt">
                    Copied!
                </div>
            </a>
        </div>
    )
}

export default SocialShare;