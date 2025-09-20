export type TeamSize = '1-10' | '11-50' | '51-100' | '101-500' | '501+';

export type FundingNeed = 'Growth' | 'Digitalisation' | 'Working Capital' | 'Export' | 'Hiring' | 'R&D';

export interface SMEProfile {
  industry: string;
  location: string;
  teamSizeBracket: TeamSize;
  needs: FundingNeed[];
  years?: number;
  isComplete: boolean;
}

export interface Grant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  summary: string;
  eligibility: string[];
  timeline?: string;
  link?: string;
  tags?: string[];
  score?: number;
  logo?: string;
}

export interface Draft {
  id: string;
  grantId: string;
  content: string;
  updatedAt: string;
}

export interface SwipeDecision {
  grantId: string;
  decision: 'accept' | 'reject';
  timestamp: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

// API Response types
export interface MatchResponse {
  grants: Grant[];
  totalCount: number;
}

export interface SubmitResponse {
  success: boolean;
  applicationId?: string;
  message: string;
}