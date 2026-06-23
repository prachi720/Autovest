import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Transaction as FinancialTransaction, UserFinancialProfile } from '../types/financial';
import {
  calculateFinancialHealthScore,
  calculateSubscriptionHealthScore,
  determineInvestmentMode,
  getHealthScoreColor,
} from '../services/financialScoring';
import {
  generateHealthScoreExplanation,
  generateSubscriptionExplanation,
  generateInvestmentExplanation,
  generateDashboardSummary,
} from '../services/aiExplanations';
import { calculateSpareChange } from '../utils/helpers';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  roundedTo: number;
  invested: number;
  date: string;
  category: string;
  spareChangeInvested?: boolean;
}

interface Goal {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
}

interface AppState {
  isAuthenticated: boolean;
  user: { name: string; email: string };
  balance: number;
  emergencyBuffer: number;
  totalInvested: number;
  portfolioGrowth: number;
  todayInvested: number;
  safetyLockActive: boolean;
  transactions: Transaction[];
  goals: Goal[];
  settings: {
    biometrics: boolean;
    encryption: boolean;
    privacyMode: boolean;
    aiInsightLevel: 'basic' | 'advanced' | 'full';
    roundUpCap: 10 | 50 | 100;
  };
  // AI Scoring State
  financialHealthScore: number;
  healthScoreColor: string;
  healthScoreLabel: string;
  investmentMode: 'Minimal' | 'Conservative' | 'Balanced' | 'Aggressive';
  investmentPercentage: number;
  subscriptionLeakRisk: number;
  potentialMonthlySavings: number;
  aiHealthExplanation: string;
  aiSubscriptionExplanation: string;
  aiInvestmentExplanation: string;
  aiDashboardSummary: string;
  monthlyIncome: number;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  addTransaction: (description: string, amount: number, category: string) => void;
  addManualInvestment: (description: string, amount: number, category: string) => void;
  investSpareChange: () => void;
  updateSetting: (key: keyof AppState['settings'], value: any) => void;
}

const defaultTransactions: Transaction[] = [
  { id: '1', description: 'Coffee Shop', amount: 143, roundedTo: 150, invested: 7, date: '2024-01-15', category: 'Food' },
  { id: '2', description: 'Uber Ride', amount: 287, roundedTo: 290, invested: 3, date: '2024-01-15', category: 'Transport' },
  { id: '3', description: 'Grocery Store', amount: 1234, roundedTo: 1240, invested: 6, date: '2024-01-14', category: 'Groceries' },
  { id: '4', description: 'Netflix', amount: 649, roundedTo: 650, invested: 1, date: '2024-01-14', category: 'Entertainment' },
  { id: '5', description: 'Electricity Bill', amount: 1876, roundedTo: 1880, invested: 4, date: '2024-01-13', category: 'Utilities' },
];

const defaultGoals: Goal[] = [
  { id: '1', name: 'House', icon: '🏠', target: 500000, current: 125000 },
  { id: '2', name: 'Travel', icon: '✈️', target: 100000, current: 42000 },
  { id: '3', name: 'Growth', icon: '📈', target: 200000, current: 78000 },
];

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: { name: '', email: '' },
    balance: 12450,
    emergencyBuffer: 8000,
    totalInvested: 4450,
    portfolioGrowth: 12.4,
    todayInvested: 21,
    safetyLockActive: false,
    transactions: defaultTransactions,
    goals: defaultGoals,
    settings: {
      biometrics: true,
      encryption: true,
      privacyMode: false,
      aiInsightLevel: 'advanced',
      roundUpCap: 10,
    },
    // AI Scoring Initial State
    financialHealthScore: 0,
    healthScoreColor: '',
    healthScoreLabel: '',
    investmentMode: 'Balanced',
    investmentPercentage: 50,
    subscriptionLeakRisk: 0,
    potentialMonthlySavings: 0,
    aiHealthExplanation: '',
    aiSubscriptionExplanation: '',
    aiInvestmentExplanation: '',
    aiDashboardSummary: '',
    monthlyIncome: 5000, // Default monthly income
  });


  // Calculate AI scores whenever transactions or financial data changes
  useEffect(() => {
    try {
      // Skip if no transactions
      if (!state.transactions || state.transactions.length === 0) {
        return;
      }

      // Convert app transactions to financial transactions
      const financialTransactions: FinancialTransaction[] = state.transactions.map(tx => ({
        id: tx.id,
        date: new Date(tx.date),
        amount: tx.amount,
        merchant: tx.description,
        category: tx.category,
        description: tx.description,
        isRecurring: tx.category === 'Entertainment' || tx.category === 'Utilities',
      }));

      const profile: UserFinancialProfile = {
        monthlyIncome: state.monthlyIncome,
        liquidSavings: state.emergencyBuffer,
        monthlyExpenses: 3200, // Could be calculated from transactions
        transactions: financialTransactions,
        marketVolatility: 0.15,
      };

      // Calculate scores
      const healthScore = calculateFinancialHealthScore(profile);
      const subscriptionHealth = calculateSubscriptionHealthScore(profile);
      // Only calculate spare change for transactions where it hasn't been invested yet
      const spareChange = state.transactions
        .filter(tx => !tx.spareChangeInvested)
        .reduce((sum, tx) => sum + calculateSpareChange(tx.amount, state.settings.roundUpCap), 0);
      const investmentDecision = determineInvestmentMode(healthScore.totalScore, spareChange, profile);

      // Generate AI explanations
      const healthExplanation = generateHealthScoreExplanation(healthScore);
      const subscriptionExplanation = generateSubscriptionExplanation(subscriptionHealth);
      const investmentExplanation = generateInvestmentExplanation(investmentDecision, healthScore.totalScore);
      const dashboardSummary = generateDashboardSummary(healthScore, subscriptionHealth, investmentDecision);

      setState(prev => ({
        ...prev,
        financialHealthScore: healthScore.totalScore,
        healthScoreColor: getHealthScoreColor(healthScore.totalScore),
        healthScoreLabel: healthScore.riskProfile,
        investmentMode: (investmentDecision.riskLevel === 'moderate' ? 'Balanced' :
          investmentDecision.riskLevel.charAt(0).toUpperCase() + investmentDecision.riskLevel.slice(1)) as any,
        investmentPercentage: Math.round(investmentDecision.aggressionMultiplier * 100),
        subscriptionLeakRisk: 100 - subscriptionHealth.totalScore,
        potentialMonthlySavings: subscriptionHealth.totalMonthlyWaste,
        aiHealthExplanation: healthExplanation,
        aiSubscriptionExplanation: subscriptionExplanation,
        aiInvestmentExplanation: investmentExplanation,
        aiDashboardSummary: dashboardSummary,
      }));
    } catch (error) {
      console.error('Error calculating AI scores:', error);
      // Set safe defaults on error
      setState(prev => ({
        ...prev,
        financialHealthScore: 0,
        healthScoreColor: 'hsl(0, 84%, 60%)',
        healthScoreLabel: 'minimal',
        investmentMode: 'Minimal',
        investmentPercentage: 10,
        subscriptionLeakRisk: 0,
        potentialMonthlySavings: 0,
        aiHealthExplanation: 'Calculating your financial health...',
        aiSubscriptionExplanation: 'Analyzing subscriptions...',
        aiInvestmentExplanation: 'Determining investment strategy...',
        aiDashboardSummary: 'Loading financial insights...',
      }));
    }
  }, [
    // Use JSON.stringify to avoid infinite loops from object reference changes
    JSON.stringify(state.transactions),
    state.emergencyBuffer,
    state.monthlyIncome,
  ]);

  const login = useCallback((email: string, _password: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: { name: 'Demo User', email },
    }));
  }, []);

  const register = useCallback((name: string, email: string, _password: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: { name, email },
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isAuthenticated: false, user: { name: '', email: '' } }));
  }, []);

  const addTransaction = useCallback((description: string, amount: number, category: string) => {
    const roundedTo = Math.ceil(amount / 10) * 10;
    const invested = roundedTo - amount;
    const newTx: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      roundedTo,
      invested,
      date: new Date().toISOString().split('T')[0],
      category,
    };
    setState(prev => {
      const newBuffer = prev.emergencyBuffer;
      const safetyLockActive = newBuffer < 5000;
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        totalInvested: safetyLockActive ? prev.totalInvested : prev.totalInvested + invested,
        todayInvested: safetyLockActive ? prev.todayInvested : prev.todayInvested + invested,
        safetyLockActive,
      };
    });
  }, []);

  const addManualInvestment = useCallback((description: string, amount: number, category: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      roundedTo: amount,
      invested: amount,
      date: new Date().toLocaleDateString('en-IN'),
      category,
      spareChangeInvested: true, // Manual investments don't generate spare change
    };
    setState(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      balance: prev.balance - amount,
      totalInvested: prev.totalInvested + amount,
    }));
  }, []);

  const investSpareChange = useCallback(() => {
    setState(prev => {
      // 1. Calculate total available spare change from uninvested transactions
      const availableTransactions = prev.transactions.filter(tx => !tx.spareChangeInvested);
      const totalSpareChange = availableTransactions.reduce(
        (sum, tx) => sum + calculateSpareChange(tx.amount, prev.settings.roundUpCap),
        0
      );

      if (totalSpareChange <= 0) return prev; // Nothing to invest

      // 2. Create investment transaction
      const investmentTx: Transaction = {
        id: `sc-${Date.now()}`,
        description: 'Spare Change Investment',
        amount: totalSpareChange,
        roundedTo: totalSpareChange,
        invested: totalSpareChange,
        date: new Date().toLocaleDateString('en-IN'),
        category: 'Investment',
        spareChangeInvested: true,
      };

      // 3. Mark source transactions as invested
      const updatedTransactions = prev.transactions.map(tx => {
        if (!tx.spareChangeInvested) {
          return { ...tx, spareChangeInvested: true };
        }
        return tx;
      });

      // 4. Update state
      return {
        ...prev,
        transactions: [investmentTx, ...updatedTransactions],
        balance: prev.balance - totalSpareChange,
        totalInvested: prev.totalInvested + totalSpareChange,
      };
    });
  }, []);

  const updateSetting = useCallback((key: keyof AppState['settings'], value: any) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  }, []);

  return (
    <AppContext.Provider value={{ ...state, login, register, logout, addTransaction, addManualInvestment, investSpareChange, updateSetting }}>
      {children}
    </AppContext.Provider>
  );
};
