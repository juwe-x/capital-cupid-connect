import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ParticleBackground } from '@/components/ui/particle-background';
import { useDeckStore } from '@/lib/stores/deck-store';

export default function Submitted() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { grants, shortlistIds } = useDeckStore();

  // Calculate total potential funding from shortlisted grants
  const shortlistedGrants = grants.filter(g => shortlistIds.includes(g.id));
  const totalFunding = shortlistedGrants.reduce((sum, grant) => {
    const amount = parseInt(grant.amount.replace(/[RM,]/g, '')) || 0;
    return sum + amount;
  }, 0);

  const applicationStages = [
    { title: 'Sent', icon: '📤', completed: true },
    { title: 'Received', icon: '📥', completed: true },
    { title: 'In Review', icon: '🔍', completed: false },
    { title: 'Decision', icon: '🏆', completed: false },
  ];

  const currentStageIndex = applicationStages.findIndex(stage => !stage.completed);
  const progressPercentage = (currentStageIndex / applicationStages.length) * 100;

  const handleExploreMore = () => {
    navigate('/swipe');
  };

  const handleDownloadPDF = () => {
    // Mock PDF download
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = 'application-summary.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
      <ParticleBackground density="medium" className="opacity-20" />
      <Header />
      
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Card className="card-floating shadow-2xl">
              <CardContent className="p-12 text-center space-y-8">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-accent to-brand-gold rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-8 h-8 text-accent" />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <div className="space-y-3">
                  <h1 className="text-3xl font-heading font-bold">
                    Application Submitted! 🎉
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Your grant application has been successfully submitted and is now under review.
                  </p>
                </div>

                {/* Total Funding */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-r from-accent/10 to-brand-gold/10 rounded-2xl p-6 border border-accent/20"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-accent">Total Potential Funding</p>
                    <p className="text-4xl font-heading font-bold text-gradient-gold">
                      RM {totalFunding.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on your shortlisted grants
                    </p>
                  </div>
                </motion.div>

                {/* Application Journey */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Application Journey</h3>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Expected decision in 6-8 weeks
                    </p>
                  </div>

                  {/* Stages */}
                  <div className="flex justify-between items-center">
                    {applicationStages.map((stage, index) => (
                      <div
                        key={stage.title}
                        className={`flex flex-col items-center space-y-2 ${
                          stage.completed ? 'text-accent' : 'text-muted-foreground'
                        }`}
                      >
                        <div className="text-2xl">{stage.icon}</div>
                        <span className="text-xs font-medium">{stage.title}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="space-y-4"
                >
                  <Button
                    onClick={handleExploreMore}
                    className="btn-hero w-full gap-2"
                    size="lg"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Explore More Grants
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="w-full gap-2 hover-lift"
                    size="lg"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF Summary
                  </Button>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-sm text-muted-foreground space-y-2"
                >
                  <p>
                    📧 We'll send you email updates about your application progress
                  </p>
                  <p>
                    💬 Questions? Contact the grant agency directly for status updates
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}