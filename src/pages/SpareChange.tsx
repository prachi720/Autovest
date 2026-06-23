import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Settings, ArrowUpRight, CheckCircle2, DollarSign, Wallet } from 'lucide-react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';
import { calculateSpareChange } from '@/utils/helpers';

const SpareChange: React.FC = () => {
    const {
        transactions,
        settings,
        investSpareChange,
        updateSetting
    } = useApp();

    const roundUpOptions = [10, 50, 100];

    // Filter transactions: exclude Income and direct Investments
    const eligibleTransactions = transactions.filter(
        tx => tx.category !== 'Income' &&
            tx.category !== 'Investment' &&
            !tx.id.startsWith('sc-')
    );

    // Calculate totals
    const availableTransactions = eligibleTransactions.filter(tx => !tx.spareChangeInvested);

    // Calculate total collected this month (both invested and pending)
    const collectedThisMonth = eligibleTransactions.reduce((sum, tx) => {
        const spare = calculateSpareChange(tx.amount, settings.roundUpCap);
        return sum + spare;
    }, 0);

    // Calculate pending available balance
    const availableSpareBalance = availableTransactions.reduce((sum, tx) => {
        const spare = calculateSpareChange(tx.amount, settings.roundUpCap);
        return sum + spare;
    }, 0);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">Spare Change</h2>
                    <p className="text-muted-foreground mt-1">
                        Turn your small change into big investments automatically
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Available Balance Card */}
                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Spare Balance</p>
                                <p className={`text-4xl font-bold mt-2 ${availableSpareBalance > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                    ₹{availableSpareBalance.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Ready to invest</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Wallet size={24} className="text-primary" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <motion.button
                                onClick={investSpareChange}
                                disabled={availableSpareBalance <= 0}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                whileHover={{ scale: availableSpareBalance > 0 ? 1.02 : 1 }}
                                whileTap={{ scale: availableSpareBalance > 0 ? 0.98 : 1 }}
                            >
                                <Coins size={18} />
                                Invest Spare Now
                            </motion.button>
                        </div>
                    </GlassCard>

                    {/* Settings & Total Card */}
                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Collected This Month</p>
                                <p className="text-4xl font-bold mt-2 text-foreground">
                                    ₹{collectedThisMonth.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Total potential from transactions</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                                <ArrowUpRight size={24} className="text-foreground" />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Settings size={14} /> Round-up Cap
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {roundUpOptions.map((cap) => (
                                    <button
                                        key={cap}
                                        onClick={() => updateSetting('roundUpCap', cap)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${settings.roundUpCap === cap
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                                            }`}
                                    >
                                        ₹{cap}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Transactions List */}
                <GlassCard depth={3} tiltIntensity={0}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-foreground">Recent Round-ups</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                            {availableTransactions.length} pending
                        </span>
                    </div>

                    <div className="space-y-4">
                        {eligibleTransactions.slice(0, 10).map((tx, index) => {
                            const spare = calculateSpareChange(tx.amount, settings.roundUpCap);
                            const isInvested = tx.spareChangeInvested;

                            return (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isInvested ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                            }`}>
                                            {isInvested ? <CheckCircle2 size={18} /> : <Coins size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Spent: ₹{tx.amount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${isInvested ? 'text-success' : 'text-primary'}`}>
                                            +₹{spare.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isInvested ? 'Invested' : 'Available'}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {eligibleTransactions.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <DollarSign size={32} className="mx-auto mb-2 opacity-30" />
                                <p>No eligible transactions found</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </Layout>
    );
};

export default SpareChange;
