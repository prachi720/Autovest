/**
 * Financial Scoring Service
 * AI-driven scoring engines for AutoVest
 */

import {
    Transaction,
    Subscription,
    FinancialBehaviorScore,
    SubscriptionHealthScore,
    InvestmentDecision,
    UserFinancialProfile,
} from '../types/financial';
import {
    mean,
    standardDeviation,
    coefficientOfVariation,
    normalizeScore,
    daysBetween,
    getRiskProfile,
    getAggressionMultiplier,
    calculateSpareChange,
} from '../utils/helpers';

/**
 * Calculate Financial Health Score (0-100)
 * 
 * Formula: FHS = (SS × 0.30) + (EB × 0.35) + (SB × 0.20) + (MR × 0.15)
 */
export function calculateFinancialHealthScore(
    profile: UserFinancialProfile
): FinancialBehaviorScore {
    const { monthlyIncome, liquidSavings, monthlyExpenses, transactions, marketVolatility = 0.15 } = profile;

    // 1. Spending Stability (30%) - based on coefficient of variation
    const monthlySpending = calculateMonthlySpending(transactions);
    const cv = coefficientOfVariation(monthlySpending);
    const spendingStabilityScore = normalizeScore(100 - cv * 100);

    // 2. Emergency Buffer (35%) - based on months of expenses saved
    const monthsOfExpenses = liquidSavings / monthlyExpenses;
    const emergencyBufferScore = normalizeScore(monthsOfExpenses * 25); // 4 months = 100

    // 3. Subscription Burden (20%) - recurring costs as % of income
    const subscriptions = detectSubscriptions(transactions);
    const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const subscriptionPercentage = (totalSubscriptionCost / monthlyIncome) * 100;
    const subscriptionBurdenScore = normalizeScore(100 - subscriptionPercentage * 2);

    // 4. Market Risk (15%) - based on volatility
    const marketRiskScore = normalizeScore(100 - marketVolatility * 500);

    // Calculate weighted total
    const totalScore = normalizeScore(
        spendingStabilityScore * 0.30 +
        emergencyBufferScore * 0.35 +
        subscriptionBurdenScore * 0.20 +
        marketRiskScore * 0.15
    );

    const riskProfile = getRiskProfile(totalScore);

    // Generate recommendations
    const recommendations: string[] = [];
    if (spendingStabilityScore < 60) {
        recommendations.push('Consider creating a monthly budget to stabilize spending patterns');
    }
    if (emergencyBufferScore < 50) {
        recommendations.push('Build emergency fund to at least 2 months of expenses');
    }
    if (subscriptionBurdenScore < 70) {
        recommendations.push('Review and cancel unused subscriptions to reduce financial burden');
    }
    if (marketRiskScore < 60) {
        recommendations.push('Consider more conservative investments during high volatility');
    }

    return {
        totalScore: Math.round(totalScore),
        breakdown: {
            spendingStability: {
                score: Math.round(spendingStabilityScore),
                weight: 0.30,
                coefficientOfVariation: cv,
                interpretation: cv < 0.2 ? 'Very stable' : cv < 0.4 ? 'Moderately stable' : 'Unstable',
            },
            emergencyBuffer: {
                score: Math.round(emergencyBufferScore),
                weight: 0.35,
                monthsOfExpenses,
                liquidSavings,
                interpretation: monthsOfExpenses >= 3 ? 'Excellent' : monthsOfExpenses >= 2 ? 'Good' : 'Needs improvement',
            },
            subscriptionBurden: {
                score: Math.round(subscriptionBurdenScore),
                weight: 0.20,
                percentageOfIncome: subscriptionPercentage,
                totalSubscriptionCost,
                interpretation: subscriptionPercentage < 10 ? 'Healthy' : subscriptionPercentage < 20 ? 'Moderate' : 'High burden',
            },
            marketRisk: {
                score: Math.round(marketRiskScore),
                weight: 0.15,
                volatilityIndex: marketVolatility,
                interpretation: marketVolatility < 0.15 ? 'Low risk' : marketVolatility < 0.25 ? 'Moderate risk' : 'High risk',
            },
        },
        riskProfile,
        recommendations,
    };
}

/**
 * Detect subscriptions from transaction patterns
 */
export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
    const subscriptionMap = new Map<string, Transaction[]>();

    // Group transactions by merchant
    transactions.forEach(tx => {
        if (tx.isRecurring) {
            const existing = subscriptionMap.get(tx.merchant) || [];
            subscriptionMap.set(tx.merchant, [...existing, tx]);
        }
    });

    const subscriptions: Subscription[] = [];

    subscriptionMap.forEach((txs, merchant) => {
        if (txs.length >= 2) {
            // Calculate average amount
            const avgAmount = mean(txs.map(t => t.amount));

            // Determine frequency based on date gaps
            const dates = txs.map(t => t.date).sort((a, b) => a.getTime() - b.getTime());
            const gaps = [];
            for (let i = 1; i < dates.length; i++) {
                gaps.push(daysBetween(dates[i - 1], dates[i]));
            }
            const avgGap = mean(gaps);

            let frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
            if (avgGap <= 7) frequency = 'weekly';
            else if (avgGap <= 35) frequency = 'monthly';
            else if (avgGap > 300) frequency = 'yearly';

            const lastCharge = dates[dates.length - 1];
            const confidence = Math.min(100, txs.length * 30); // More occurrences = higher confidence

            subscriptions.push({
                id: `sub-${merchant.toLowerCase().replace(/\s/g, '-')}`,
                merchant,
                amount: avgAmount,
                frequency,
                lastCharge,
                detectedPattern: confidence,
                daysSinceLastUse: daysBetween(lastCharge, new Date()),
            });
        }
    });

    return subscriptions;
}

/**
 * Calculate Subscription Health Score and leak risk
 */
export function calculateSubscriptionHealthScore(
    profile: UserFinancialProfile
): SubscriptionHealthScore {
    const subscriptions = detectSubscriptions(profile.transactions);
    const now = new Date();

    const subscriptionAnalysis = subscriptions.map(sub => {
        // Usage Confidence (40%) - based on days since last use
        const daysSinceUse = sub.daysSinceLastUse || 0;
        const usageConfidence = daysSinceUse > 60 ? 0 : normalizeScore(100 - daysSinceUse);

        // Cost Burden (35%) - subscription cost as % of income
        const costPercentage = (sub.amount / profile.monthlyIncome) * 100;
        const costBurden = normalizeScore(100 - costPercentage * 5);

        // Affordability Factor (25%) - simple heuristic
        const affordabilityFactor = sub.amount < 20 ? 100 : sub.amount < 50 ? 70 : 50;

        // Calculate health score
        const healthScore = normalizeScore(
            usageConfidence * 0.40 +
            costBurden * 0.35 +
            affordabilityFactor * 0.25
        );

        // Determine if should cancel
        const shouldCancel = healthScore < 40 || daysSinceUse > 60;
        const cancelConfidence = shouldCancel ? normalizeScore(100 - healthScore) : 0;

        // Generate reasoning
        let reasoning = '';
        if (daysSinceUse > 60) {
            reasoning = `No activity detected in ${daysSinceUse} days - likely unused`;
        } else if (costPercentage > 5) {
            reasoning = `High cost burden (${costPercentage.toFixed(1)}% of income)`;
        } else if (healthScore > 70) {
            reasoning = 'Actively used and affordable';
        } else {
            reasoning = 'Monitor usage patterns';
        }

        const potentialSavings = shouldCancel ? sub.amount : 0;

        return {
            subscription: sub,
            healthScore: Math.round(healthScore),
            usageConfidence: Math.round(usageConfidence),
            costBurden: Math.round(costBurden),
            shouldCancel,
            cancelConfidence: Math.round(cancelConfidence),
            reasoning,
            potentialSavings,
        };
    });

    // Calculate total score (average of all subscription health scores)
    const totalScore = subscriptionAnalysis.length > 0
        ? Math.round(mean(subscriptionAnalysis.map(s => s.healthScore)))
        : 100;

    const totalMonthlyWaste = subscriptionAnalysis
        .filter(s => s.shouldCancel)
        .reduce((sum, s) => sum + s.potentialSavings, 0);

    const recommendations: string[] = [];
    if (totalMonthlyWaste > 0) {
        recommendations.push(`Cancel unused subscriptions to save ₹${totalMonthlyWaste.toFixed(2)}/month`);
    }
    if (subscriptionAnalysis.some(s => s.costBurden < 50)) {
        recommendations.push('Consider cheaper alternatives for high-cost subscriptions');
    }
    if (totalScore < 60) {
        recommendations.push('Review all subscriptions for usage and value');
    }

    return {
        totalScore,
        subscriptions: subscriptionAnalysis,
        totalMonthlyWaste,
        recommendations,
    };
}

/**
 * Determine adaptive investment mode and calculate investment amount
 */
export function determineInvestmentMode(
    healthScore: number,
    spareChange: number,
    profile: UserFinancialProfile
): InvestmentDecision {
    const baseMultiplier = getAggressionMultiplier(healthScore);

    // Apply confidence boosts
    let confidenceBoost = 1.0;

    // Boost for stable spending (3+ months)
    const monthlySpending = calculateMonthlySpending(profile.transactions);
    if (monthlySpending.length >= 3) {
        const cv = coefficientOfVariation(monthlySpending);
        if (cv < 0.2) confidenceBoost += 0.10;
    }

    // Boost for good emergency buffer
    const monthsOfExpenses = profile.liquidSavings / profile.monthlyExpenses;
    if (monthsOfExpenses > 3) confidenceBoost += 0.15;

    // Boost for low subscription burden
    const subscriptions = detectSubscriptions(profile.transactions);
    const subCost = subscriptions.reduce((sum, s) => sum + s.amount, 0);
    if (subCost / profile.monthlyIncome < 0.10) confidenceBoost += 0.05;

    const finalMultiplier = Math.min(baseMultiplier * confidenceBoost, 1.0);
    const investmentAmount = spareChange * finalMultiplier;

    const riskLevel = getRiskProfile(healthScore);
    const shouldInvest = healthScore >= 35 && profile.liquidSavings > profile.monthlyExpenses;

    // Generate reasoning
    let reasoning = '';
    if (!shouldInvest) {
        reasoning = 'Investment paused - build emergency fund first';
    } else if (healthScore >= 80) {
        reasoning = `Strong financial health (${healthScore}/100) - investing ${Math.round(finalMultiplier * 100)}% of spare change`;
    } else if (healthScore >= 60) {
        reasoning = `Good financial position - balanced approach with ${Math.round(finalMultiplier * 100)}% investment rate`;
    } else {
        reasoning = `Conservative approach recommended - investing ${Math.round(finalMultiplier * 100)}% until health improves`;
    }

    const recommendations: string[] = [];
    if (healthScore < 60) {
        recommendations.push('Focus on improving financial health score for better returns');
    }
    if (monthsOfExpenses < 3) {
        recommendations.push('Prioritize building 3-month emergency fund');
    }
    if (confidenceBoost > 1.15) {
        recommendations.push('Excellent financial discipline - maximizing investment potential');
    }

    return {
        shouldInvest,
        amount: Math.round(investmentAmount * 100) / 100,
        aggression: Math.round(healthScore),
        reasoning,
        spareChange,
        aggressionMultiplier: finalMultiplier,
        riskLevel,
        recommendations,
    };
}

/**
 * Helper: Calculate monthly spending totals
 */
function calculateMonthlySpending(transactions: Transaction[]): number[] {
    const monthlyTotals = new Map<string, number>();

    transactions.forEach(tx => {
        const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, current + tx.amount);
    });

    return Array.from(monthlyTotals.values());
}

/**
 * Get health score color based on value
 */
export function getHealthScoreColor(score: number): string {
    if (score >= 80) return 'hsl(142, 71%, 45%)'; // Green - Excellent
    if (score >= 60) return 'hsl(193, 100%, 50%)'; // Blue - Good
    if (score >= 40) return 'hsl(38, 92%, 50%)'; // Yellow - Fair
    return 'hsl(0, 84%, 60%)'; // Red - Poor
}

/**
 * Get health score label
 */
export function getHealthScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
}
