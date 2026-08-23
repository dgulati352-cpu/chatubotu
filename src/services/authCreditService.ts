import { UserProfile, CreditAccount } from '../types/user';

export class AuthCreditService {
  private static STORAGE_KEY_USER = 'antigravity_google_user';
  private static STORAGE_KEY_CREDITS = 'antigravity_user_credits';

  public static getSavedUser(): UserProfile | null {
    const raw = localStorage.getItem(this.STORAGE_KEY_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
    // Default initial signed-in Google ID for seamless Antigravity experience
    const defaultUser: UserProfile = {
      id: 'usr_g_88492019',
      googleId: '109283746192837461928',
      email: 'developer.antigravity@gmail.com',
      name: 'Dhairya Gulati',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      plan: 'Antigravity Ultra',
      tierLevel: 'Tier 3 (Enterprise Developer)',
      organization: 'DeepMind Antigravity Labs',
      createdAt: '2026-08-01T00:00:00Z'
    };
    this.saveUser(defaultUser);
    return defaultUser;
  }

  public static saveUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY_USER);
    }
  }

  public static getSavedCredits(): CreditAccount {
    const raw = localStorage.getItem(this.STORAGE_KEY_CREDITS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse credits', e);
      }
    }
    const defaultCredits: CreditAccount = {
      standardCredits: 8420,
      maxStandardCredits: 10000,
      premiumCredits: 920,
      maxPremiumCredits: 1000,
      lastFetchedAt: Date.now(),
      isAutoFetching: true,
      renewalDate: 'Daily midnight UTC (18h remaining)',
      tokensUsedToday: 42800,
      concurrentAgentSlots: 4,
      rateLimitStatus: 'HEALTHY'
    };
    this.saveCredits(defaultCredits);
    return defaultCredits;
  }

  public static saveCredits(credits: CreditAccount) {
    localStorage.setItem(this.STORAGE_KEY_CREDITS, JSON.stringify(credits));
  }

  public static async fetchCreditsFromGoogleId(googleId: string, email: string): Promise<CreditAccount> {
    // Simulated Google Cloud / AI Studio credit telemetry fetch
    await new Promise(r => setTimeout(r, 600));

    // Dynamic calculation based on user email / Google ID
    const isPro = email.includes('google') || email.includes('pro') || email.includes('antigravity') || email.includes('dhairya') || email.includes('gmail');
    
    const credits: CreditAccount = {
      standardCredits: isPro ? 8420 : 4500,
      maxStandardCredits: isPro ? 10000 : 5000,
      premiumCredits: isPro ? 920 : 250,
      maxPremiumCredits: isPro ? 1000 : 500,
      lastFetchedAt: Date.now(),
      isAutoFetching: true,
      renewalDate: 'Daily midnight UTC',
      tokensUsedToday: isPro ? 58200 : 12400,
      concurrentAgentSlots: isPro ? 4 : 2,
      rateLimitStatus: 'HEALTHY'
    };

    this.saveCredits(credits);
    return credits;
  }

  public static deductCredits(
    currentCredits: CreditAccount,
    isPremium: boolean = false,
    amount: number = 1
  ): CreditAccount {
    const updated = { ...currentCredits };
    if (isPremium) {
      updated.premiumCredits = Math.max(0, updated.premiumCredits - amount * 5);
      updated.tokensUsedToday += amount * 1800;
    } else {
      updated.standardCredits = Math.max(0, updated.standardCredits - amount * 2);
      updated.tokensUsedToday += amount * 850;
    }
    updated.lastFetchedAt = Date.now();
    this.saveCredits(updated);
    return updated;
  }
}
