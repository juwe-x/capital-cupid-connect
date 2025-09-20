import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Send, FileText, Lightbulb, Minimize2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useDeckStore } from '@/lib/stores/deck-store';
import { useDraftStore } from '@/lib/stores/draft-store';
import { useToast } from '@/hooks/use-toast';
import { grantsApi } from '@/lib/api';
import type { Grant } from '@/lib/types';

export default function Apply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { grants } = useDeckStore();
  const { getDraft, saveDraft } = useDraftStore();
  
  const [grant, setGrant] = useState<Grant | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Find grant in shortlist
    const foundGrant = grants.find(g => g.id === id);
    if (foundGrant) {
      setGrant(foundGrant);
      // Load existing draft or create AI-generated one
      const existingDraft = getDraft(id);
      if (existingDraft) {
        setContent(existingDraft.content);
      } else {
        // Generate AI draft
        generateAIDraft(foundGrant);
      }
    }
    setIsLoading(false);
  }, [id, grants, getDraft]);

  const generateAIDraft = (grant: Grant) => {
    // Mock AI-generated draft content
    const aiDraft = `[AI-Generated Draft Application]

Dear ${grant.agency},

I am writing to formally apply for the ${grant.title} on behalf of my company.

Our business operates in the technology sector and has been providing innovative solutions to our clients for the past few years. We believe this grant opportunity aligns perfectly with our growth objectives and strategic vision.

**Project Overview:**
We are seeking funding to expand our operations and enhance our service offerings. The requested funding will be utilized for:

• Research and development of new technologies
• Expansion of our team and operational capacity  
• Implementation of sustainable business practices
• Market development and customer acquisition

**Expected Outcomes:**
With this grant funding, we anticipate achieving significant milestones including increased revenue, job creation, and contribution to the local economy. Our projected timeline for implementation is 12-18 months.

**Company Qualifications:**
Our team possesses the necessary expertise and experience to successfully execute this project. We have a proven track record of delivering results and maintaining high standards of operational excellence.

We are committed to meeting all grant requirements and providing regular progress reports as needed. Thank you for considering our application.

Sincerely,
[Your Name]
[Company Name]`;

    setContent(aiDraft);
    saveDraft(id!, aiDraft);
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      saveDraft(id, content);
      toast({
        title: "Draft saved",
        description: "Your application has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!id || !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await grantsApi.submit(id, content);
      navigate(`/submitted/${id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyAISuggestion = (type: 'clarity' | 'shorten' | 'formal') => {
    // Mock AI suggestions
    const suggestions = {
      clarity: content.replace(/[.]\s+/g, '. Our approach ensures '),
      shorten: content.substring(0, Math.floor(content.length * 0.7)) + '...',
      formal: content.replace(/we are/gi, 'we remain').replace(/our/gi, 'our organization\'s')
    };
    
    setContent(suggestions[type]);
    saveDraft(id!, suggestions[type]);
    
    toast({
      title: "AI Enhancement Applied",
      description: `Your application has been improved for ${type}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
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
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Grant not found</h1>
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
      
      {/* Top Bar */}
      <div className="bg-neutral-light border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/shortlist" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Shortlist
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-heading font-bold">Application Editor</h1>
                <p className="text-sm text-muted-foreground">{grant.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className="btn-hero gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Shortlist */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Shortlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {grants.filter(g => useDeckStore.getState().shortlistIds.includes(g.id)).map((g) => (
                  <motion.div
                    key={g.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      g.id === id ? 'border-accent bg-accent/10' : 'hover:border-accent/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/apply/${g.id}`)}
                  >
                    <h4 className="font-medium text-sm leading-tight">{g.title}</h4>
                    <p className="text-xs text-muted-foreground">{g.agency}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center - Editor */}
          <div className="col-span-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{grant.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Application deadline: {new Date(grant.deadline).toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary">
                    <FileText className="w-3 h-3 mr-1" />
                    Draft
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-4">
                  <label className="text-sm font-medium">Application Content</label>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your grant application here..."
                  className="flex-1 min-h-[400px] font-mono text-sm"
                />
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>{content.length} characters</span>
                  <span>{content.split(' ').length} words</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - AI Suggestions */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    AI Suggestions
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSuggestions(!showSuggestions)}
                  >
                    {showSuggestions ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {showSuggestions && (
                <CardContent className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg cursor-pointer hover:border-accent/50"
                    onClick={() => applyAISuggestion('clarity')}
                  >
                    <h4 className="font-medium text-sm">Improve Clarity</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make your language more professional and clear
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg cursor-pointer hover:border-accent/50"
                    onClick={() => applyAISuggestion('shorten')}
                  >
                    <h4 className="font-medium text-sm">Shorten to 500 words</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optimize length for better readability
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg cursor-pointer hover:border-accent/50"
                    onClick={() => applyAISuggestion('formal')}
                  >
                    <h4 className="font-medium text-sm">More Formal Tone</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enhance professionalism and formality
                    </p>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}