import { onCleanup, onMount } from 'solid-js';

function useOutsideAlerter(ref, callback) {
  const handleClickOutside = (event) => {
    if (ref && !ref.contains(event.target)) {
      callback && callback();
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
}

export default useOutsideAlerter;
