/**
 * Core TypeScript interfaces for AutoVest AI Financial Scoring System
 */

export interface Transaction {
    id: string;
    date: Date;
    amount: number;
    merchant: string;
    category: string;
    description: string;
    isRecurring?: boolean;
}

export interface Subscription {
    id: string;
    merchant: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    lastCharge: Date;
    detectedPattern: number; // confidence 0-100
    estimatedNextCharge?: Date;
    daysSinceLastUse?: number;
}

export interface FinancialBehaviorScore {
    totalScore: number; // 0-100
    breakdown: {
        spendingStability: {
            score: number; // 0-100
            weight: number; // 0.30
            coefficientOfVariation: number;
            interpretation: string;
        };
        emergencyBuffer: {
            score: number; // 0-100
            weight: number; // 0.35
            monthsOfExpenses: number;
            liquidSavings: number;
            interpretation: string;
        };
        subscriptionBurden: {
            score: number; // 0-100
            weight: number; // 0.20
            percentageOfIncome: number;
            totalSubscriptionCost: number;
            interpretation: string;
        };
        marketRisk: {
            score: number; // 0-100
            weight: number; // 0.15
            volatilityIndex: number;
            interpretation: string;
        };
    };
    riskProfile: 'aggressive' | 'moderate' | 'conservative' | 'minimal';
    recommendations: string[];
}

export interface SubscriptionHealthScore {
    totalScore: number; // 0-100
    subscriptions: Array<{
        subscription: Subscription;
        healthScore: number; // 0-100
        usageConfidence: number; // 0-100
        costBurden: number; // 0-100
        shouldCancel: boolean;
        cancelConfidence: number; // 0-100
        reasoning: string;
        potentialSavings: number;
    }>;
    totalMonthlyWaste: number;
    recommendations: string[];
}

export interface InvestmentDecision {
    shouldInvest: boolean;
    amount: number;
    aggression: number; // 0-100
    reasoning: string;
    spareChange: number;
    aggressionMultiplier: number;
    riskLevel: 'aggressive' | 'moderate' | 'conservative' | 'minimal';
    recommendations: string[];
}

export interface UserFinancialProfile {
    monthlyIncome: number;
    liquidSavings: number;
    monthlyExpenses: number;
    transactions: Transaction[];
    marketVolatility?: number; // 0-1, default 0.15
}

export interface FinancialAnalysisResult {
    financialBehaviorScore: FinancialBehaviorScore;
    subscriptionHealthScore: SubscriptionHealthScore;
    investmentDecision: InvestmentDecision;
    timestamp: Date;
    profile: UserFinancialProfile;
}
