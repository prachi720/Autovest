/**
 * Utility functions for financial calculations and statistical analysis
 */

/**
 * Calculate the mean (average) of an array of numbers
 */
export function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate the standard deviation of an array of numbers
 */
export function standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
    const variance = mean(squaredDiffs);
    return Math.sqrt(variance);
}

/**
 * Calculate the coefficient of variation (CV)
 * CV = (standard deviation / mean) * 100
 * Lower CV = more stable spending
 */
export function coefficientOfVariation(values: number[]): number {
    const avg = mean(values);
    if (avg === 0) return 0;
    const stdDev = standardDeviation(values);
    return stdDev / avg;
}

/**
 * Normalize a score to 0-100 range
 */
export function normalizeScore(value: number, min: number = 0, max: number = 100): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Group transactions by month
 */
export function groupByMonth(transactions: { date: Date; amount: number }[]): Map<string, number> {
    const monthlyTotals = new Map<string, number>();

    transactions.forEach(tx => {
        const monthKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
        const current = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, current + tx.amount);
    });

    return monthlyTotals;
}

/**
 * Calculate spare change from a transaction amount
 * Rounds up to nearest cap (10, 50, 100) and returns the difference
 */
export function calculateSpareChange(amount: number, cap: number = 10): number {
    const rounded = Math.ceil(amount / cap) * cap;
    const spare = rounded - amount;
    return spare === 0 ? 0 : parseFloat(spare.toFixed(2));
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

/**
 * Determine risk profile based on score
 */
export function getRiskProfile(score: number): 'aggressive' | 'moderate' | 'conservative' | 'minimal' {
    if (score >= 80) return 'aggressive';
    if (score >= 60) return 'moderate';
    if (score >= 40) return 'conservative';
    return 'minimal';
}

/**
 * Get aggression multiplier based on financial behavior score
 */
export function getAggressionMultiplier(score: number): number {
    // Base multiplier of 0.3, scales up to 1.0 based on score
    return 0.3 + (score / 100) * 0.7;
}
