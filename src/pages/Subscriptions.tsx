/**
 * Subscriptions Management Page
 * View and manage subscriptions with AI-powered leak detection
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, TrendingUp, Calendar, DollarSign, X } from 'lucide-react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';

interface SubscriptionItem {
    id: string;
    name: string;
    monthlyCost: number;
    billingCycle: 'monthly' | 'yearly' | 'quarterly';
    leakRisk: 'Low' | 'Medium' | 'High';
    lastUsed: string;
    category: string;
    cancelled: boolean;
}

const Subscriptions = () => {
    const app = useApp();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionItem | null>(null);
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([
        {
            id: '1',
            name: 'Netflix',
            monthlyCost: 649,
            billingCycle: 'monthly',
            leakRisk: 'Medium',
            lastUsed: '15 days ago',
            category: 'Entertainment',
            cancelled: false,
        },
        {
            id: '2',
            name: 'Spotify Premium',
            monthlyCost: 119,
            billingCycle: 'monthly',
            leakRisk: 'Low',
            lastUsed: '2 days ago',
            category: 'Entertainment',
            cancelled: false,
        },
        {
            id: '3',
            name: 'Adobe Creative Cloud',
            monthlyCost: 3999,
            billingCycle: 'monthly',
            leakRisk: 'High',
            lastUsed: '45 days ago',
            category: 'Productivity',
            cancelled: false,
        },
        {
            id: '4',
            name: 'Amazon Prime',
            monthlyCost: 299,
            billingCycle: 'monthly',
            leakRisk: 'Low',
            lastUsed: '1 day ago',
            category: 'Shopping',
            cancelled: false,
        },
        {
            id: '5',
            name: 'Gym Membership',
            monthlyCost: 1500,
            billingCycle: 'monthly',
            leakRisk: 'High',
            lastUsed: '30 days ago',
            category: 'Health',
            cancelled: false,
        },
    ]);

    const activeSubscriptions = subscriptions.filter(s => !s.cancelled);
    const totalMonthlyCost = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);

    // Calculate potential savings from high-risk subscriptions
    const potentialSavings = activeSubscriptions
        .filter(sub => sub.leakRisk === 'High' || sub.leakRisk === 'Medium')
        .reduce((sum, sub) => sum + sub.monthlyCost, 0);

    // Calculate leak risk percentage
    const highRiskCount = activeSubscriptions.filter(sub => sub.leakRisk === 'High').length;
    const mediumRiskCount = activeSubscriptions.filter(sub => sub.leakRisk === 'Medium').length;
    const leakRiskPercentage = activeSubscriptions.length > 0
        ? Math.round(((highRiskCount * 100 + mediumRiskCount * 50) / activeSubscriptions.length))
        : 0;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'hsl(142, 71%, 45%)';
            case 'Medium': return 'hsl(38, 92%, 50%)';
            case 'High': return 'hsl(0, 84%, 60%)';
            default: return 'hsl(215, 13%, 63%)';
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case 'Low': return CheckCircle2;
            case 'Medium': return AlertTriangle;
            case 'High': return XCircle;
            default: return AlertTriangle;
        }
    };

    const calculateHealthScoreImpact = (subscription: SubscriptionItem) => {
        // Higher cost and higher risk = bigger impact
        const costFactor = subscription.monthlyCost / 1000;
        const riskFactor = subscription.leakRisk === 'High' ? 3 : subscription.leakRisk === 'Medium' ? 2 : 1;
        return Math.round(costFactor * riskFactor);
    };

    const handleCancelClick = (subscription: SubscriptionItem) => {
        setSelectedSubscription(subscription);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (!selectedSubscription) return;

        // Mark subscription as cancelled
        setSubscriptions(prev =>
            prev.map(sub =>
                sub.id === selectedSubscription.id ? { ...sub, cancelled: true } : sub
            )
        );

        // Show success message
        setTimeout(() => {
            setShowCancelModal(false);
            setSelectedSubscription(null);
        }, 2000);
    };

    return (
        <Layout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground font-display">Subscription Management</h2>
                    <p className="text-muted-foreground mt-1">Manage your subscriptions and reduce unnecessary spending</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Monthly Cost</p>
                                <p className="text-3xl font-bold mt-2 text-foreground">₹{totalMonthlyCost.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-muted-foreground mt-1">{activeSubscriptions.length} active subscriptions</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <DollarSign size={20} className="text-primary" />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Potential Savings</p>
                                <p className="text-3xl font-bold mt-2 text-success">₹{potentialSavings.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-muted-foreground mt-1">From unused subscriptions</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                <TrendingUp size={20} className="text-success" />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard depth={5} tiltIntensity={0}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Leak Risk</p>
                                <p className="text-3xl font-bold mt-2 text-warning">{leakRiskPercentage}%</p>
                                <p className="text-xs text-muted-foreground mt-1">AI-detected risk score</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-warning" />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Subscriptions List */}
                <GlassCard depth={3} tiltIntensity={0}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Your Subscriptions</h3>
                    <div className="space-y-3">
                        {subscriptions.map((subscription, index) => {
                            const RiskIcon = getRiskIcon(subscription.leakRisk);
                            const healthImpact = calculateHealthScoreImpact(subscription);

                            return (
                                <motion.div
                                    key={subscription.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-4 rounded-xl border transition-colors duration-300 ${subscription.cancelled
                                        ? 'bg-muted/20 border-muted opacity-60'
                                        : 'bg-card/30 border-border'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Subscription Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-foreground">
                                                    {subscription.name}
                                                    {subscription.cancelled && (
                                                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <DollarSign size={14} />
                                                    <span className="font-medium text-foreground">₹{subscription.monthlyCost}</span>
                                                    <span>/month</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    <span className="capitalize">{subscription.billingCycle}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs">Last used: {subscription.lastUsed}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Risk Badge */}
                                        <div
                                            className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium"
                                            style={{
                                                backgroundColor: `${getRiskColor(subscription.leakRisk)}15`,
                                                color: getRiskColor(subscription.leakRisk),
                                            }}
                                        >
                                            <RiskIcon size={16} />
                                            <span>{subscription.leakRisk} Risk</span>
                                        </div>

                                        {/* Cancel Button */}
                                        {!subscription.cancelled && (
                                            <motion.button
                                                onClick={() => handleCancelClick(subscription)}
                                                className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-medium text-sm hover:bg-destructive/20 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Cancel
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Cancellation Modal */}
                <AnimatePresence>
                    {showCancelModal && selectedSubscription && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                        >
                            <motion.div
                                className="relative w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                {/* Modal Content */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">Cancel {selectedSubscription.name}?</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            You're about to cancel this subscription
                                        </p>
                                    </div>

                                    {/* Impact Preview */}
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                                        <div className="flex items-center gap-2 text-success">
                                            <TrendingUp size={18} />
                                            <span className="font-semibold">Positive Impact</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-foreground">
                                                💰 <span className="font-semibold">Save ₹{selectedSubscription.monthlyCost}/month</span>
                                            </p>
                                            <p className="text-foreground">
                                                📈 <span className="font-semibold">Financial Health Score +{calculateHealthScoreImpact(selectedSubscription)} points</span>
                                            </p>
                                            <p className="text-muted-foreground">
                                                Cancelling this subscription will reduce your subscription burden and improve your investment capacity.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowCancelModal(false)}
                                            className="flex-1 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                                        >
                                            Keep Subscription
                                        </button>
                                        <motion.button
                                            onClick={handleConfirmCancel}
                                            className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Confirm Cancel
                                        </motion.button>
                                    </div>

                                    {/* Success Message */}
                                    {selectedSubscription.cancelled && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-xl bg-success/10 border border-success/20 text-center"
                                        >
                                            <p className="text-success font-semibold text-lg">🎉 You saved ₹{selectedSubscription.monthlyCost}/month!</p>
                                            <p className="text-sm text-muted-foreground mt-1">Your financial health score has been updated</p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default Subscriptions;
