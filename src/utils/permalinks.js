import slugify from 'limax';
import { trim } from '~/utils/text';
import mixpanel from 'mixpanel-browser';
import { registeredEvents } from '~/components/core/swup';

export const createPath = (...params) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (paths ? '/' : '');
};

export const trimSlash = (s) => trim(trim(s, '/'));

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const POST_PERMALINK_PATTERN = trimSlash('project/%slug%');

export const checkIsPostPage = (path) => {
  const createPattern = (pattern) => {
    const regexPattern = pattern.replace('%slug%', '[^/]+');
    return new RegExp('^' + regexPattern + '$');
  };

  const currentPath = trimSlash(path);
  const regex = createPattern(POST_PERMALINK_PATTERN);
  return regex.test(currentPath);
};

export const trackMixPanel = () => {
  const trackType = {
    Contact: {
      'wa.me': 'whatapps',
      't.me': 'telegram',
      mailto: 'email',
    },
    Social: {
      'linkedin.com': 'linkedin',
      'x.com': 'x/twitter',
      'dribbble.com': 'dribbble',
    },
  };

  const checkType = (el, arr) => {
    for (const [type, links] of Object.entries(arr)) {
      for (const [key, value] of Object.entries(links)) {
        if (el.href.includes(key)) {
          mixpanel.track(type, { type: value });
          return;
        }
      }
    }
  };
  document.querySelectorAll('a').forEach((el) => {
    if (!el.dataset.trackingAlready) {
      const handler = () => checkType(el, trackType);
      el.addEventListener('click', handler);
      el.dataset.trackingAlready = 'true';

      if (el.closest('main')) {
        registeredEvents.push({ type: 'click', handler: handler, element: el });
      }
    }
  });
};
