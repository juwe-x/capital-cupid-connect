import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Building, Target, DollarSign, FileText, Heart, Zap } from 'lucide-react';

interface ShuffleCard {
  id: string;
  title: string;
  agency: string;
  amount: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

const mockCards: ShuffleCard[] = [
  {
    id: '1',
    title: 'Digital Transformation Grant',
    agency: 'MDEC',
    amount: 'RM 50,000',
    icon: Zap,
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: '2',
    title: 'SME Innovation Fund',
    agency: 'SIRIM',
    amount: 'RM 100,000',
    icon: Target,
    gradient: 'from-green-500 to-teal-600'
  },
  {
    id: '3',
    title: 'Export Development Grant',
    agency: 'MATRADE',
    amount: 'RM 75,000',
    icon: Building,
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: '4',
    title: 'Technology Adoption Fund',
    agency: 'MOSTI',
    amount: 'RM 200,000',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: '5',
    title: 'Startup Growth Fund',
    agency: 'Cradle',
    amount: 'RM 150,000',
    icon: Heart,
    gradient: 'from-indigo-500 to-blue-600'
  }
];

export function ShuffleCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockCards.length);
        setIsAnimating(false);
      }, 300); // Half of the transition duration
    }, 6000); // 6 second cycle

    return () => clearInterval(interval);
  }, []);

  const currentCard = mockCards[currentIndex];
  const nextCard = mockCards[(currentIndex + 1) % mockCards.length];

  return (
    <div className="relative w-80 h-96 mx-auto">
      {/* Background cards for depth */}
      <motion.div
        className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30"
        style={{ transform: 'translate(8px, 8px) scale(0.95)' }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl shadow-md border border-white/20"
        style={{ transform: 'translate(4px, 4px) scale(0.98)' }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main card */}
      <motion.div
        className="relative w-full h-full bg-white rounded-2xl shuffle-card-glow border border-white/40 overflow-hidden"
        animate={{
          x: isAnimating ? [-20, 0] : 0,
          opacity: isAnimating ? [1, 0.7, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, #ff4081, #ffc107)`,
            opacity: 0.1,
            filter: 'blur(20px)'
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Card content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentCard.gradient} flex items-center justify-center`}>
              <currentCard.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium">Funding</div>
              <div className="text-lg font-bold text-gradient-gold">{currentCard.amount}</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {currentCard.title}
          </h3>

          {/* Agency */}
          <p className="text-sm text-muted-foreground mb-4">
            {currentCard.agency}
          </p>

          {/* Description */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-magenta rounded-full"
                  animate={{
                    width: ['0%', '85%', '100%'],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">Match Score: 85%</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-xs rounded-full">
                Technology
              </span>
              <span className="px-2 py-1 bg-brand-magenta/10 text-brand-magenta text-xs rounded-full">
                Innovation
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Deadline: Dec 2024</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Shortlisted
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next card preview (slides in from right) */}
      <motion.div
        className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-white/30 opacity-0"
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: isAnimating ? [100, 0] : 100,
          opacity: isAnimating ? [0, 0.3, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut"
        }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${nextCard.gradient} flex items-center justify-center`}>
              <nextCard.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium">Funding</div>
              <div className="text-lg font-bold text-gradient-gold">{nextCard.amount}</div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {nextCard.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {nextCard.agency}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
