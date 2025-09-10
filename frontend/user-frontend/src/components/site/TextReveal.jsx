import React from 'react';
import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import clsx from 'clsx';

const TextReveal = ({ text, className, delay = 0.1 }) => {
  const ref = React.useRef();
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  const isVisible = intersection && intersection.intersectionRatio > 0.1;

  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={clsx('text-reveal', className)}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={wordVariants}
          style={{ perspective: '1000px' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;