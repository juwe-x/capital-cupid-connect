import { motion } from 'framer-motion';
import { useState } from 'react';

interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function GhostButton({ 
  children, 
  onClick, 
  className = '', 
  asChild = false,
  size = 'lg'
}: GhostButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  const baseClasses = `
    relative overflow-hidden rounded-xl font-semibold transition-all duration-300
    ${sizeClasses[size]}
    bg-transparent border-2 border-brand-magenta text-brand-magenta
    hover:bg-brand-magenta/10 hover:text-brand-magenta
    shadow-sm hover:shadow-md
    ghost-button
    min-w-[140px]
    flex items-center justify-center
    ${className}
  `;

  const buttonContent = (
    <motion.button
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      animate={{
        y: isHovered ? -2 : 0,
        scale: isHovered ? 1.03 : 1,
        borderColor: isHovered ? '#ff4081' : '#ff4081',
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* Gradient underline animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-magenta to-brand-gold rounded-full"
        initial={{ width: 0 }}
        animate={{ 
          width: isHovered ? '100%' : 0 
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />
      
      {/* Background fill animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-magenta/5 to-brand-gold/5 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      />

      {/* Button content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.button>
  );

  if (asChild) {
    return buttonContent;
  }

  return buttonContent;
}
