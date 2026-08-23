export interface UserProfile {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'Antigravity Pro' | 'Antigravity Ultra' | 'Enterprise Developer';
  tierLevel: string;
  organization?: string;
  createdAt: string;
}

export interface CreditAccount {
  standardCredits: number;
  maxStandardCredits: number;
  premiumCredits: number;
  maxPremiumCredits: number;
  lastFetchedAt: number;
  isAutoFetching: boolean;
  renewalDate: string;
  tokensUsedToday: number;
  concurrentAgentSlots: number;
  rateLimitStatus: 'HEALTHY' | 'MODERATE' | 'NEARING_LIMIT';
}
