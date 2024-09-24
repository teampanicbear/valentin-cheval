import { onCleanup, onMount } from 'solid-js';
import { registeredEvents } from '~/components/core/swup';

function useOutsideAlerter(ref, callback) {
  const handleClickOutside = (event) => {
    if (ref && !ref.contains(event.target)) {
      callback && callback();
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    registeredEvents.push({ type: 'mousedown', handler: handleClickOutside, element: document });
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
}

export default useOutsideAlerter;
