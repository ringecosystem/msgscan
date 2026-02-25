import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import useMounted from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

const animationVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

interface BackToTopButtonProps {
  className?: string;
}
const BackToTopButton = ({ className }: BackToTopButtonProps) => {
  const [pageYOffset, setPageYOffset] = React.useState(0);
  const isVisible = pageYOffset > 200;
  const isMounted = useMounted();

  React.useEffect(() => {
    const handleScroll = () => setPageYOffset(window.scrollY);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && isMounted && (
        <motion.button
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          exit={animationVariants.exit}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className={cn(
            'group z-[1000] flex cursor-pointer items-center justify-center rounded border-none bg-card p-1 text-sm',
            className
          )}
        >
          <ArrowUp
            size={18}
            className="text-card-foreground group-hover:opacity-80"
            strokeWidth={1.5}
          />
          <span className="text-xs text-card-foreground group-hover:opacity-80">Back to Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
