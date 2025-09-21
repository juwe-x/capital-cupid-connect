import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Heart, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TinderShuffleCards } from '@/components/ui/tinder-shuffle-cards';
import { StellarBurstButton } from '@/components/ui/stellar-burst-button';
import { GhostButton } from '@/components/ui/ghost-button';
import { ParticleBackground } from '@/components/ui/particle-background';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const journeySteps = [
  { title: 'Profile', icon: Target, description: 'Tell us about your business' },
  { title: 'Match', icon: Heart, description: 'AI finds perfect grants' },
  { title: 'Docs', icon: FileText, description: 'Assisted application prep' },
  { title: 'Submit', icon: Zap, description: 'One-click submission' },
];

const valueProps = [
  {
    title: 'AI-Powered Matching',
    description: 'Our smart algorithm analyzes your business profile and finds the most relevant government grants.',
    icon: Target,
  },
  {
    title: 'Swipe to Shortlist',
    description: 'Browse through matched grants with simple swipe gestures. Save interesting opportunities instantly.',
    icon: Heart,
  },
  {
    title: 'Assisted Documentation',
    description: 'AI helps you prepare professional applications with guided templates and smart suggestions.',
    icon: FileText,
  },
];

const Index = () => {
  const [currentJourneyStep, setCurrentJourneyStep] = useState(0);
  const [isCTAInteracting, setIsCTAInteracting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJourneyStep((prev) => (prev + 1) % journeySteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-pink-50 to-yellow-50">
        <ParticleBackground 
          density="medium" 
          isCTAInteracting={isCTAInteracting}
        />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-heading font-bold leading-tight">
                  Find your perfect{' '}
                  <span className="text-gradient-gold">funding match</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Discover government grants for your SME as easy as swiping.
                  Our AI matches you with the most relevant funding opportunities.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <StellarBurstButton
                  asChild
                  size="lg"
                  onMouseEnter={() => setIsCTAInteracting(true)}
                  onMouseLeave={() => setIsCTAInteracting(false)}
                  className="flex-1 sm:flex-none"
                >
                  <Link to="/account-creation">
                    Start My Match
                  </Link>
                </StellarBurstButton>
                <GhostButton asChild size="lg" className="flex-1 sm:flex-none">
                  <Link to="#learn-more">
                    Learn More
                  </Link>
                </GhostButton>
              </div>

              {/* Mini Journey Bar */}
              <motion.div 
                className="bg-card border rounded-2xl p-6 shadow-soft"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  {journeySteps.map((step, index) => (
                    <div key={step.title} className="flex items-center">
                      <div className={`flex items-center space-x-2 transition-all duration-300 ${
                        index === currentJourneyStep ? 'text-accent' : 'text-muted-foreground'
                      }`}>
                        <step.icon className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">
                          {step.title}
                        </span>
                      </div>
                      {index < journeySteps.length - 1 && (
                        <div className="mx-3 w-8 h-0.5 bg-muted">
                          <motion.div
                            className="h-full bg-accent"
                            initial={{ width: '0%' }}
                            animate={{
                              width: index < currentJourneyStep ? '100%' : '0%'
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Animation - Tinder Shuffle Cards */}
            <motion.div 
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <TinderShuffleCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-neutral-light">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Why Choose CapitalCupid?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've reimagined the grant application process to be simple, smart, and successful.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                <Card className="card-floating hover-tilt group h-full cursor-pointer">
                  <CardContent className="p-8 text-center space-y-4">
                    <motion.div 
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent to-brand-gold rounded-2xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3, ease: "easeInOut" }
                      }}
                    >
                      <prop.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-heading font-bold"
                      whileHover={{
                        color: "#ff4081",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {prop.title}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground"
                      whileHover={{
                        color: "#374151",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {prop.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
