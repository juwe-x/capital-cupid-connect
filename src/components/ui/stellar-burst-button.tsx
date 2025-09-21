import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Heart, DollarSign } from 'lucide-react';

interface StellarBurstButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface Particle {
  id: string;
  type: 'heart' | 'coin';
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
}

export function StellarBurstButton({ 
  children, 
  onClick, 
  className = '', 
  asChild = false,
  size = 'lg'
}: StellarBurstButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Create 5-7 particles
    const particleCount = Math.floor(Math.random() * 3) + 5; // 5-7 particles
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      type: Math.random() > 0.5 ? 'heart' : 'coin',
      x: 50 + (Math.random() - 0.5) * 20, // Center with some spread
      y: 50 + (Math.random() - 0.5) * 20,
      angle: (i * 60) + Math.random() * 30 - 15, // Spread around
      velocity: 0.8 + Math.random() * 0.4, // 0.8-1.2
      size: 16 + Math.random() * 8 // 16-24px
    }));
    
    setParticles(newParticles);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  const baseClasses = `
    relative overflow-hidden rounded-xl font-semibold transition-all duration-200 ease-in-out
    ${sizeClasses[size]}
    bg-gradient-to-r from-brand-gold to-brand-orange text-white
    hover:from-brand-gold/90 hover:to-brand-orange/90
    shadow-lg hover:shadow-xl
    border-2 border-transparent hover:border-brand-gold/30
    stellar-button
    min-w-[140px]
    flex items-center justify-center
    ${className}
  `;

  const buttonContent = (
    <motion.button
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -2 : 0,
        boxShadow: isHovered 
          ? '0 8px 25px rgba(255, 193, 7, 0.4), 0 0 30px rgba(255, 193, 7, 0.3)'
          : '0 4px 12px rgba(255, 193, 7, 0.3)'
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #ffc107, #ff9800)',
          opacity: 0.05,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          zIndex: -1
        }}
        animate={{
          opacity: isHovered ? 0.15 : 0.05,
          scale: isHovered ? 1.15 : 1.1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      />

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${particle.size}px`
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 0.8
            }}
            animate={{
              x: Math.cos(particle.angle * Math.PI / 180) * 80 * particle.velocity,
              y: Math.sin(particle.angle * Math.PI / 180) * 80 * particle.velocity - 20, // Float upward
              opacity: [1, 0.8, 0],
              scale: [0.8, 1, 0.6],
              rotate: particle.type === 'coin' ? [0, 360] : [0, 15, -15, 0]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
          >
            {particle.type === 'heart' ? (
              <Heart className="w-4 h-4 text-brand-magenta fill-current" />
            ) : (
              <DollarSign className="w-4 h-4 text-brand-gold" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.button>
  );

  if (asChild) {
    return buttonContent;
  }

  return buttonContent;
}
