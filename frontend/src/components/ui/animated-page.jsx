import React from 'react';
import { motion } from 'framer-motion';

// Diferentes tipos de animações
const animationVariants = {
  // Deslizar da esquerda para direita (padrão)
  slide: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  // Fade simples
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  // Escala (zoom in/out)
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  // De baixo para cima
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  // Sem animação
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

const AnimatedPage = ({
  children,
  variant = 'fade',
  duration = 0.3,
  delay = 0,
  className = 'h-full',
}) => {
  const selectedVariant = animationVariants[variant] || animationVariants.fade;

  return (
    <motion.div
      variants={selectedVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration,
        delay,
        ease: [0.4, 0.0, 0.2, 1], // Cubic bezier para transição suave
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
