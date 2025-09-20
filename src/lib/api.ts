import type { SMEProfile, Grant, MatchResponse, SubmitResponse, Draft } from './types';

// Detect environment and set base URL
const getBaseUrl = () => {
  // For Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || '/api';
  }
  // For Next.js (fallback)
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Default to local mock API
  return '/api';
};

const BASE_URL = getBaseUrl();

// Generic API wrapper
export async function api<T>(
  path: string,
  init?: Omit<RequestInit, 'body'> & { body?: any }
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  
  const config: RequestInit = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      // Future: Add Authorization header for Cognito
      // Authorization: `Bearer ${getCognitoToken()}`,
      ...init?.headers,
    },
  };

  if (init?.body && typeof init.body === 'object') {
    config.body = JSON.stringify(init.body);
  } else if (init?.body) {
    config.body = init.body;
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// API endpoints
export const grantsApi = {
  // Get matched grants based on profile
  match: async (profile: SMEProfile): Promise<MatchResponse> => {
    // For now, return mock data - in production this would call real API
    return mockMatchGrants(profile);
  },

  // Get grant by ID
  getById: async (id: string): Promise<Grant> => {
    return api<Grant>(`/grants/${id}`);
  },

  // Get shortlisted grants
  getShortlist: async (grantIds: string[]): Promise<Grant[]> => {
    // Mock implementation - in production would batch fetch
    const allGrants = await mockGetAllGrants();
    return allGrants.filter(grant => grantIds.includes(grant.id));
  },

  // Submit application
  submit: async (grantId: string, content: string): Promise<SubmitResponse> => {
    // Mock implementation - in production would call real API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          applicationId: `app-${Date.now()}`,
          message: 'Application submitted successfully'
        });
      }, 1000);
    });
  },
};

export const draftsApi = {
  // Save draft
  save: async (grantId: string, content: string): Promise<{ id: string }> => {
    return api<{ id: string }>('/drafts', {
      method: 'POST',
      body: { grantId, content },
    });
  },

  // Update draft
  update: async (draftId: string, content: string): Promise<void> => {
    return api<void>(`/drafts/${draftId}`, {
      method: 'PATCH',
      body: { content },
    });
  },

  // Submit application
  submit: async (grantId: string, draftId: string): Promise<SubmitResponse> => {
    return api<SubmitResponse>('/submit', {
      method: 'POST',
      body: { grantId, draftId },
    });
  },
};

// Mock implementations for development
async function mockMatchGrants(profile: SMEProfile): Promise<MatchResponse> {
  const allGrants = await mockGetAllGrants();
  
  // Simple matching logic based on profile
  const matched = allGrants
    .map(grant => ({
      ...grant,
      score: calculateMatchScore(grant, profile),
    }))
    .filter(grant => (grant.score || 0) > 0.3)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    grants: matched,
    totalCount: matched.length,
  };
}

function calculateMatchScore(grant: Grant, profile: SMEProfile): number {
  let score = 0.5; // base score
  
  // Industry matching
  if (grant.tags?.some(tag => 
    tag.toLowerCase().includes(profile.industry.toLowerCase())
  )) {
    score += 0.3;
  }
  
  // Needs matching
  profile.needs.forEach(need => {
    if (grant.tags?.some(tag => 
      tag.toLowerCase().includes(need.toLowerCase())
    )) {
      score += 0.1;
    }
  });
  
  return Math.min(score, 1);
}

async function mockGetAllGrants(): Promise<Grant[]> {
  // In production, this would fetch from the API
  // For now, return static mock data
  return [
    {
      id: 'mdec-digital-boost',
      title: 'MDEC Digital Boost Initiative',
      agency: 'Malaysia Digital Economy Corporation',
      amount: 'RM 50,000 - RM 200,000',
      deadline: '2024-12-31',
      summary: 'Funding for SMEs to accelerate digital transformation and adopt Industry 4.0 technologies.',
      eligibility: [
        'Malaysian-owned SME',
        'Annual revenue below RM50 million',
        'Established for at least 2 years',
        'Technology or manufacturing sector'
      ],
      timeline: '4-6 weeks processing',
      tags: ['Technology', 'Digitalisation', 'Manufacturing'],
      score: 0.85,
      logo: 'MDEC'
    },
    {
      id: 'sme-corp-export',
      title: 'SME Corp Export Enhancement Grant',
      agency: 'SME Corporation Malaysia',
      amount: 'RM 100,000 - RM 500,000',
      deadline: '2024-11-15',
      summary: 'Support for SMEs looking to expand into international markets and boost export capabilities.',
      eligibility: [
        'Valid SSM registration',
        'Minimum 60% Malaysian ownership',
        'Export-ready products/services',
        'Financial capacity for co-funding'
      ],
      timeline: '6-8 weeks processing',
      tags: ['Export', 'Growth', 'International'],
      score: 0.75,
      logo: 'SME'
    },
    {
      id: 'cradle-cip',
      title: 'CRADLE Commercialisation of Innovation Programme',
      agency: 'CRADLE Fund',
      amount: 'RM 250,000 - RM 1,000,000',
      deadline: '2024-10-30',
      summary: 'Funding for innovative startups and SMEs to commercialize R&D results and innovative solutions.',
      eligibility: [
        'Malaysian company',
        'Technology-based innovation',
        'Proof of concept completed',
        'Clear commercialization plan'
      ],
      timeline: '8-12 weeks processing',
      tags: ['R&D', 'Innovation', 'Technology'],
      score: 0.70,
      logo: 'CRADLE'
    }
  ];
}