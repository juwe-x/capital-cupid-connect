import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Building, 
  MapPin, 
  DollarSign, 
  Target, 
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Star,
  Bookmark,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useDeckStore } from '@/lib/stores/deck-store';
import { grantsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Grant } from '@/lib/types';

export default function GrantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { grants, shortlistIds, addToShortlist, removeFromShortlist } = useDeckStore();
  
  const [grant, setGrant] = useState<Grant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/shortlist');
      return;
    }

    loadGrant();
  }, [id, navigate]);

  const loadGrant = async () => {
    try {
      setIsLoading(true);
      
      // First try to find in existing grants
      const existingGrant = grants.find(g => g.id === id);
      if (existingGrant) {
        setGrant(existingGrant);
        setIsShortlisted(shortlistIds.includes(id));
      } else {
        // If not found, fetch from API
        const fetchedGrant = await grantsApi.getById(id);
        setGrant(fetchedGrant);
        setIsShortlisted(shortlistIds.includes(id));
      }
    } catch (error) {
      console.error('Failed to load grant:', error);
      toast({
        title: "Error loading grant",
        description: "Failed to load grant details. Please try again.",
        variant: "destructive",
      });
      navigate('/shortlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlistToggle = () => {
    if (!grant) return;
    
    if (isShortlisted) {
      removeFromShortlist(grant.id);
      setIsShortlisted(false);
      toast({
        title: "Removed from shortlist",
        description: "Grant has been removed from your shortlist.",
      });
    } else {
      addToShortlist(grant.id);
      setIsShortlisted(true);
      toast({
        title: "Added to shortlist",
        description: "Grant has been added to your shortlist.",
      });
    }
  };

  const handleApply = () => {
    if (!grant) return;
    navigate(`/apply/${grant.id}`);
  };

  const isNearDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-MY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMatchPercentage = () => {
    // Mock match percentage based on grant score
    return grant?.score ? Math.min(95, Math.max(75, grant.score)) : 85;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="flex flex-col items-center justify-center space-y-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
            />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-heading font-bold">Loading grant details...</h2>
              <p className="text-muted-foreground">Fetching grant information.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-heading font-bold">Grant not found</h2>
            <p className="text-muted-foreground">The grant you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/shortlist">Back to Shortlist</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Navigation */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/shortlist">
              <ArrowLeft className="w-4 h-4" />
              Back to Shortlist
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grant Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-brand-navy rounded-xl text-white text-lg font-bold">
                        {grant.logo || grant.agency.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="text-3xl font-heading font-bold mb-2">{grant.title}</h1>
                        <Link 
                          to="#" 
                          className="text-lg text-brand-magenta hover:text-brand-magenta/80 transition-colors font-medium"
                        >
                          {grant.agency}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShortlistToggle}
                        className={cn(
                          "gap-2",
                          isShortlisted 
                            ? "bg-brand-gold text-white border-brand-gold hover:bg-brand-gold/90" 
                            : "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"
                        )}
                      >
                        <Bookmark className={cn("w-4 h-4", isShortlisted && "fill-current")} />
                        {isShortlisted ? 'Saved' : 'Save'}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Quick Apply Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleApply}
                      className="bg-brand-magenta hover:bg-brand-magenta/90 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                    >
                      Quick Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI-Generated Suggestion Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-blue-900">AI-generated summary</span>
                      <Badge variant="secondary" className="text-xs bg-blue-200 text-blue-800">
                        BETA
                      </Badge>
                    </div>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    This grant is perfect for your {grant.tags?.[0]?.toLowerCase() || 'business'} needs! 
                    You might like this opportunity because it offers substantial funding of {grant.amount}, 
                    aligns with your industry focus, and provides excellent growth potential. 
                    The application process is straightforward, and the deadline gives you ample time to prepare a strong proposal.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Grant Details Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Why it matches you */}
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-gold" />
                    Why This Grant Matches You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Industry alignment: {grant.tags?.[0] || 'Technology'}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Funding amount matches your needs</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Timeline fits your project schedule</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">High success probability: {getMatchPercentage()}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-gold" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grant.eligibility.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grant Description */}
              <Card className="shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle>Grant Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {grant.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              {grant.timeline && (
                <Card className="shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brand-gold" />
                      Application Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {grant.timeline}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Grant Information Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-lg rounded-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-brand-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Funding Amount</span>
                      <p className="text-2xl font-bold text-gradient-gold">{grant.amount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Deadline</span>
                      <p className={cn(
                        "font-semibold",
                        isNearDeadline(grant.deadline) ? "text-red-500" : "text-foreground"
                      )}>
                        {formatDeadline(grant.deadline)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-brand-gold" />
                    <div>
                      <span className="text-sm text-muted-foreground">Match Score</span>
                      <p className="text-xl font-bold text-brand-gold">{getMatchPercentage()}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Location</span>
                      <p className="font-medium">Malaysia</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Job Type</span>
                      <Badge className="bg-blue-100 text-blue-800">Government Grant</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">Posted</span>
                      <span className="text-sm text-muted-foreground">few days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* View Similar Jobs Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white gap-2">
                <Link to="/swipe">
                  <Target className="w-4 h-4" />
                  View Similar Grants
                </Link>
              </Button>
            </motion.div>

            {/* External Link */}
            {grant.link && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button variant="outline" asChild className="w-full gap-2">
                  <a href={grant.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Official Grant Page
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
