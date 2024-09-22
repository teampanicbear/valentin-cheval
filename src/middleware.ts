import { defineMiddleware } from 'astro:middleware';
import type { Element, Root } from 'hast';
import { rehype } from 'rehype';
import { visit } from 'unist-util-visit';

function isCssLink(node) {
  if (!node || node.tagName !== 'link') {
    return false;
  }

  const rel = node.properties && node.properties.rel;
  if (!rel || !rel.includes('stylesheet')) {
    return false;
  }

  const href = node.properties && node.properties.href;
  if (!href || typeof href !== 'string') {
    return false;
  }

  const type = node.properties && node.properties.type;
  if (type && type !== 'text/css') {
    return false;
  }

  return true;
}

const rehypeInstance = rehype().use(() => (tree: Root) => {
  let head: Element | undefined;
  const links: Element[] = [];
  visit(tree, 'element', (node) => {
    if (node.tagName === 'head') head = node;
    if (isCssLink(node))
      links.push({
        type: 'element',
        tagName: 'link',
        properties: { rel: 'preload', as: 'style', href: node.properties.href },
        children: [],
      });
  });
  head?.children.unshift(...links);
});

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  if (response.headers.get('content-type') !== 'text/html') return response;

  const html = await response.text();
  const file = await rehypeInstance.process(html);

  console.log(file);

  return new Response(file.toString(), response);
});
