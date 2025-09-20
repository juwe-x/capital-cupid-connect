import { motion } from 'framer-motion';
import { useState } from 'react';

export function AnimatedCupid() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-64 h-64 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sparkle particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            top: `${20 + (i * 15)}%`,
            left: `${15 + (i * 12)}%`,
          }}
          animate={{
            scale: isHovered ? [1, 1.5, 1] : [0.5, 1, 0.5],
            opacity: isHovered ? [0, 1, 0] : [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Main cupid icon container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Arrow morphing to coin */}
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="text-primary"
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Arrow shape that morphs to coin */}
          <motion.path
            d={isHovered 
              ? "M60 20 A40 40 0 1 1 60 100 A40 40 0 1 1 60 20" // Circle
              : "M30 60 L90 60 M70 40 L90 60 L70 80" // Arrow
            }
            stroke="currentColor"
            strokeWidth="4"
            fill={isHovered ? "currentColor" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Heart in center when morphed to coin */}
          <motion.path
            d="M60 45 C55 35, 40 35, 40 50 C40 65, 60 75, 60 75 C60 75, 80 65, 80 50 C80 35, 65 35, 60 45 Z"
            fill="white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          
          {/* Dollar sign overlay */}
          <motion.text
            x="60"
            y="70"
            textAnchor="middle"
            className="text-lg font-bold fill-white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            RM
          </motion.text>
        </motion.svg>

        {/* Floating hearts */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-primary/40"
            style={{
              top: `${30 + (i * 20)}%`,
              right: `${10 + (i * 8)}%`,
            }}
            animate={{
              y: isHovered ? [-10, -20, -10] : [0, -5, 0],
              opacity: isHovered ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ♥
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}