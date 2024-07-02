import { createBreakpoint } from 'react-use';

const breakpoint = createBreakpoint({
  default: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
});

const useBreakpoint = () => {
  const result = breakpoint();

  if (result === 'default' || result === 'sm') {
    return 'mobile';
  } else if (result === 'md') {
    return 'pad';
  } else {
    return 'desktop';
  }
};

export default useBreakpoint;
