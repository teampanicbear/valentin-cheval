import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';

const ProjectScript = () => {
  let scriptRef;

  onMount(() => {
    if (!scriptRef) return;
  });

  return <div ref={scriptRef} class="divScript"></div>;
};
export default ProjectScript;
