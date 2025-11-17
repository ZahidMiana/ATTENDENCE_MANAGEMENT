import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: 60,
  },
};

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
  },
};

export const slideInFromRight: Variants = {
  initial: {
    x: 400,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 120,
    },
  },
  exit: {
    x: 400,
    opacity: 0,
  },
};

export const slideInFromLeft: Variants = {
  initial: {
    x: -400,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 120,
    },
  },
  exit: {
    x: -400,
    opacity: 0,
  },
};

export const scaleIn: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 260,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};

export const rotateIn: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    rotate: 180,
  },
};

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 0 20px rgba(0,245,255,0.3)',
  },
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: '0 20px 60px rgba(0,245,255,0.4)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0,245,255,0.5)',
      '0 0 40px rgba(0,245,255,0.8)',
      '0 0 20px rgba(0,245,255,0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
