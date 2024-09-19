import slugify from 'limax';
import { trim } from '~/utils/text';

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
