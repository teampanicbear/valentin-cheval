import H2 from './H2.astro';
import H3 from './H3.astro';
import H4 from './H4.astro';
import P from './P.astro';
import Link from './Link.astro';
import Image from './ImageArticle.astro';

export const mdxComponents = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  a: Link,
  img: Image,
};
