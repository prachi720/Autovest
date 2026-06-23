/**
 * Mock transaction data for hackathon demo
 */

import { Transaction, UserFinancialProfile } from '../types/financial';

/**
 * Generate mock transactions for the past 3 months
 */
export function generateMockTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();

    // Recurring subscriptions (monthly)
    const subscriptions = [
        { merchant: 'Netflix', amount: 15.99, category: 'Entertainment' },
        { merchant: 'Spotify', amount: 9.99, category: 'Entertainment' },
        { merchant: 'Amazon Prime', amount: 14.99, category: 'Shopping' },
        { merchant: 'Planet Fitness', amount: 24.99, category: 'Health' },
        { merchant: 'Adobe Creative Cloud', amount: 54.99, category: 'Software' },
    ];

    // Generate 3 months of subscription charges
    for (let month = 0; month < 3; month++) {
        subscriptions.forEach((sub, idx) => {
            const date = new Date(now);
            date.setMonth(date.getMonth() - month);
            date.setDate(5 + idx); // Spread throughout the month

            transactions.push({
                id: `sub-${month}-${idx}`,
                date,
                amount: sub.amount,
                merchant: sub.merchant,
                category: sub.category,
                description: `Monthly subscription - ${sub.merchant}`,
                isRecurring: true,
            });
        });
    }

    // Regular expenses
    const regularExpenses = [
        { merchant: 'Whole Foods', category: 'Groceries', baseAmount: 85 },
        { merchant: 'Target', category: 'Shopping', baseAmount: 45 },
        { merchant: 'Shell Gas Station', category: 'Transportation', baseAmount: 50 },
        { merchant: 'Starbucks', category: 'Dining', baseAmount: 6.5 },
        { merchant: 'Chipotle', category: 'Dining', baseAmount: 12 },
        { merchant: 'Electric Company', category: 'Utilities', baseAmount: 120 },
        { merchant: 'Internet Provider', category: 'Utilities', baseAmount: 79.99 },
    ];

    // Generate varied regular expenses
    for (let month = 0; month < 3; month++) {
        regularExpenses.forEach((expense, idx) => {
            const numTransactions = expense.category === 'Groceries' ? 8 :
                expense.category === 'Dining' ? 12 :
                    expense.category === 'Utilities' ? 1 : 4;

            for (let i = 0; i < numTransactions; i++) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - month);
                date.setDate(Math.floor(Math.random() * 28) + 1);

                // Add some variation to amounts
                const variation = 0.8 + Math.random() * 0.4; // ±20% variation
                const amount = expense.baseAmount * variation;

                transactions.push({
                    id: `exp-${month}-${idx}-${i}`,
                    date,
                    amount: Math.round(amount * 100) / 100,
                    merchant: expense.merchant,
                    category: expense.category,
                    description: `${expense.category} purchase`,
                    isRecurring: expense.category === 'Utilities',
                });
            }
        });
    }

    // Sort by date (most recent first)
    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return transactions;
}

/**
 * Generate a complete mock user financial profile
 */
export function generateMockProfile(): UserFinancialProfile {
    const transactions = generateMockTransactions();

    return {
        monthlyIncome: 5000,
        liquidSavings: 8500,
        monthlyExpenses: 3200,
        transactions,
        marketVolatility: 0.15, // 15% volatility (moderate)
    };
}

/**
 * Generate a high-score profile (good financial health)
 */
export function generateHealthyProfile(): UserFinancialProfile {
    const transactions = generateMockTransactions();

    return {
        monthlyIncome: 6500,
        liquidSavings: 25000, // ~4 months of expenses
        monthlyExpenses: 3000,
        transactions,
        marketVolatility: 0.10, // Low volatility
    };
}

/**
 * Generate a low-score profile (poor financial health)
 */
export function generateStrugglingProfile(): UserFinancialProfile {
    const transactions = generateMockTransactions();

    // Add more subscriptions to increase burden
    const extraSubs = [
        { merchant: 'Disney+', amount: 7.99 },
        { merchant: 'HBO Max', amount: 15.99 },
        { merchant: 'Apple Music', amount: 10.99 },
        { merchant: 'YouTube Premium', amount: 11.99 },
    ];

    const now = new Date();
    extraSubs.forEach((sub, idx) => {
        for (let month = 0; month < 3; month++) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - month);
            date.setDate(10 + idx);

            transactions.push({
                id: `extra-sub-${month}-${idx}`,
                date,
                amount: sub.amount,
                merchant: sub.merchant,
                category: 'Entertainment',
                description: `Monthly subscription - ${sub.merchant}`,
                isRecurring: true,
            });
        }
    });

    return {
        monthlyIncome: 4000,
        liquidSavings: 1200, // Less than 1 month of expenses
        monthlyExpenses: 3500,
        transactions,
        marketVolatility: 0.25, // High volatility
    };
}
