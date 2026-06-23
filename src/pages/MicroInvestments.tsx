/**
 * Micro Investments Page
 * View and manage spare change investments with AI insights
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, DollarSign, Calendar, ArrowUpCircle, X, Sparkles, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';

const MicroInvestments = () => {
    const app = useApp();
    const [showBoostModal, setShowBoostModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [boostAmount, setBoostAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Investment');

    // Calculate summary metrics from transactions
    const totalMicroInvested = app.transactions.reduce((sum, t) => sum + t.invested, 0);
    const averagePerTransaction = app.transactions.length > 0
        ? totalMicroInvested / app.transactions.length
        : 0;
    const investmentCount = app.transactions.length;

    const categories = ['Investment', 'Stocks', 'Mutual Funds', 'Crypto', 'Gold', 'Bonds', 'Other'];

    const handleBoostInvestment = () => {
        const amount = parseFloat(boostAmount);
        if (amount > 0 && description.trim() && app.balance >= amount) {
            // Add manual investment using AppContext method
            app.addManualInvestment(description.trim(), amount, category);

            // Show success and reset
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowBoostModal(false);
                setBoostAmount('');
                setDescription('');
                setCategory('Investment');
            }, 2000);
        }
    };

    const isFormValid = boostAmount && parseFloat(boostAmount) > 0 && description.trim() && app.balance >= parseFloat(boostAmount);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">Micro Investments</h2>
                    <p className="text-muted-foreground mt-1">Track your spare change investments and boost your portfolio</p>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Invested</p>
                                <p className="text-3xl font-bold mt-2 text-foreground">₹{totalMicroInvested.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-muted-foreground mt-1">From {investmentCount} transactions</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <DollarSign size={20} className="text-primary" />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg per Transaction</p>
                                <p className="text-3xl font-bold mt-2 text-accent">₹{averagePerTransaction.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground mt-1">Spare change invested</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <TrendingUp size={20} className="text-accent" />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Investment Mode</p>
                                <p className="text-3xl font-bold mt-2 text-success">{app.investmentMode}</p>
                                <p className="text-xs text-muted-foreground mt-1">{app.investmentPercentage}% of spare change</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                <Zap size={20} className="text-success" />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* AI Explanation Section */}
                <GlassCard depth={3} tiltIntensity={0}>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-2">AI Investment Insights</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {app.aiInvestmentExplanation ||
                                    `Your current ${app.investmentMode} investment mode is investing ${app.investmentPercentage}% of your spare change. 
                                    This strategy is optimized based on your financial health score of ${app.financialHealthScore}/100. 
                                    The AI automatically adjusts your investment percentage to balance growth with financial stability.`
                                }
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Investment History */}
                <GlassCard depth={3} tiltIntensity={0}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Investment History</h3>
                        <motion.button
                            onClick={() => setShowBoostModal(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowUpCircle size={16} />
                            Boost Investment
                        </motion.button>
                    </div>

                    <div className="space-y-3">
                        {app.transactions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Zap size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No investments yet. Start spending to build your portfolio!</p>
                            </div>
                        ) : (
                            app.transactions.map((transaction, index) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-xl border border-border bg-card/30"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-foreground">{transaction.description}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                    {transaction.category}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <DollarSign size={14} />
                                                    <span>Spent: ₹{transaction.amount}</span>
                                                </div>
                                                {transaction.roundedTo !== transaction.amount && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span>→</span>
                                                        <span>Rounded: ₹{transaction.roundedTo}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    <span>{transaction.date}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Invested</p>
                                            <p className="text-2xl font-bold text-success">₹{transaction.invested}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </GlassCard>

                {/* Boost Investment Modal */}
                <AnimatePresence>
                    {showBoostModal && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !showSuccessMessage && setShowBoostModal(false)}
                        >
                            <motion.div
                                className="relative w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {!showSuccessMessage && (
                                    <button
                                        onClick={() => setShowBoostModal(false)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}

                                {showSuccessMessage ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-8 flex flex-col items-center gap-4"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                            className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
                                        >
                                            <CheckCircle size={32} className="text-success" />
                                        </motion.div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-foreground">Investment Added!</p>
                                            <p className="text-sm text-muted-foreground mt-1">₹{boostAmount} invested successfully</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">Boost Your Investment</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Add a manual investment to accelerate your portfolio growth
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Description</label>
                                            <input
                                                type="text"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="e.g., Monthly SIP, Bonus Investment"
                                                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={boostAmount}
                                                onChange={(e) => setBoostAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Available balance: ₹{app.balance.toLocaleString('en-IN')}
                                            </p>
                                        </div>

                                        {boostAmount && parseFloat(boostAmount) > app.balance && (
                                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                                <p className="text-sm text-destructive">
                                                    ⚠️ Insufficient balance. You need ₹{(parseFloat(boostAmount) - app.balance).toFixed(2)} more.
                                                </p>
                                            </div>
                                        )}

                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                                            <p className="text-sm text-muted-foreground">
                                                💡 <span className="font-semibold text-foreground">Tip:</span> Regular small investments
                                                compound over time. Even ₹100 can make a difference!
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowBoostModal(false)}
                                                className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                onClick={handleBoostInvestment}
                                                disabled={!isFormValid}
                                                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Invest Now
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default MicroInvestments;
