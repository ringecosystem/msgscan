import { useEffect, useState } from 'react';

const MOBILE_MAX_WIDTH = 767;
const PAD_MAX_WIDTH = 1023;

const useBreakpoint = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (width <= MOBILE_MAX_WIDTH) {
    return 'mobile';
  } else if (width <= PAD_MAX_WIDTH) {
    return 'pad';
  } else {
    return 'desktop';
  }
};

export default useBreakpoint;
