import { motion } from 'framer-motion';

interface FadeInDownProps {
  duration?: number;
}
const FadeInDown = ({ children, duration = 0.5 }: React.PropsWithChildren<FadeInDownProps>) => {
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration, ease: 'easeOut' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default FadeInDown;
