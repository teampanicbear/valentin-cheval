import { createSignal, onCleanup, onMount } from 'solid-js';
import { registeredEvents } from '~/components/core/swup';

function useDimension() {
  const [deviceType, setDeviceType] = createSignal(getDeviceType());

  function getDeviceType() {
    const width = window.innerWidth;
    if (width >= 992) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  function handleResize() {
    setDeviceType(getDeviceType());
  }

  onMount(() => {
    window.addEventListener('resize', handleResize);
    registeredEvents.push({ type: 'resize', handler: handleResize, element: window });
    // Cleanup event listener on unmount
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
    });
  });

  return {
    isDesktop: () => deviceType() === 'desktop',
    isTablet: () => deviceType() === 'tablet',
    isMobile: () => deviceType() === 'mobile',
  };
}

export default useDimension;
