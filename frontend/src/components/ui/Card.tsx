import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, transition: { duration: 0.3 } } : {}}
      className={`bg-white rounded-2xl shadow-md overflow-hidden ${hover ? 'hover:shadow-xl' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};