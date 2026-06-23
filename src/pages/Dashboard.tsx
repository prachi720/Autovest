import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Wallet, Heart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { HealthScoreBadge } from '@/components/HealthScoreBadge';
import { InvestmentModeIndicator } from '@/components/InvestmentModeIndicator';
import { calculateSpareChange, formatCurrency } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

const miniChartData = [
  Array.from({ length: 12 }, (_, i) => ({ v: 40 + Math.sin(i / 2) * 15 + i * 2 })),
  Array.from({ length: 12 }, (_, i) => ({ v: 20 + i * 3 + Math.random() * 5 })),
  Array.from({ length: 12 }, (_, i) => ({ v: 60 + Math.sin(i / 3) * 10 })),
  Array.from({ length: 12 }, (_, i) => ({ v: 30 + i * 4 + Math.sin(i) * 8 })),
];

const statCards = [
  { key: 'balance', label: 'Total Balance', icon: Wallet, prefix: '₹', suffix: '', format: 'number', trend: '+2.4%', up: true },
  { key: 'todayInvested', label: 'Invested Today', icon: TrendingUp, prefix: '₹', suffix: '', format: 'number', trend: '+₹21', up: true },
  { key: 'emergencyBuffer', label: 'Emergency Buffer', icon: Shield, prefix: '₹', suffix: '', format: 'number', trend: 'Secure', up: true },
  { key: 'healthScore', label: 'Financial Health', icon: Heart, prefix: '', suffix: '', format: 'score', trend: '', up: true },
] as const;

const Dashboard: React.FC = () => {
  const app = useApp();
  const navigate = useNavigate();
  const { transactions, settings } = app;

  // Calculate available spare change (matching SpareChange.tsx logic)
  const availableSpareChange = transactions
    .filter(tx =>
      tx.category !== 'Income' &&
      tx.category !== 'Investment' &&
      !tx.id.startsWith('sc-') &&
      !tx.spareChangeInvested
    )
    .reduce((sum, tx) => sum + calculateSpareChange(tx.amount, settings.roundUpCap || 10), 0);

  const getValue = (key: string) => {
    switch (key) {
      case 'balance': return app.balance;
      case 'todayInvested': return app.todayInvested;
      case 'emergencyBuffer': return app.emergencyBuffer;
      case 'healthScore': return app.financialHealthScore;
      default: return 0;
    }
  };

  const recentTransactions = app.transactions.slice(0, 4);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Welcome back, {app.user.name || 'Investor'}</h2>
          <p className="text-muted-foreground mt-1">Here's your financial overview</p>
        </div>

        {/* Stat Cubes with mini charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <GlassCard tiltIntensity={8} depth={5}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    {stat.format === 'score' ? (
                      <div className="mt-2">
                        <HealthScoreBadge
                          score={app.financialHealthScore}
                          size="sm"
                          showTrend={false}
                        />
                      </div>
                    ) : (
                      <p className="text-2xl font-bold mt-1 text-foreground">
                        {stat.prefix}{stat.format === 'decimal' ? getValue(stat.key).toFixed(1) : getValue(stat.key).toLocaleString('en-IN')}
                        {stat.suffix || ''}
                      </p>
                    )}
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon size={18} className="text-primary" />
                  </div>
                </div>
                {stat.format !== 'score' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {stat.up ? <ArrowUpRight size={14} className="text-success" /> : <ArrowDownRight size={14} className="text-destructive" />}
                      <span className="text-xs font-medium text-success">{stat.trend}</span>
                    </div>
                    <div className="w-20 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={miniChartData[i]}>
                          <defs>
                            <linearGradient id={`mini-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke="hsl(193, 100%, 50%)" strokeWidth={1.5} fill={`url(#mini-${i})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* AI Investment Mode Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <InvestmentModeIndicator
            mode={app.investmentMode}
            percentage={app.investmentPercentage}
            reasoning={app.aiInvestmentExplanation.split('\n')[0]}
          />
        </motion.div>

        {/* Spare Change Counter + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard
            className="lg:col-span-1 cursor-pointer hover:border-primary/30 transition-colors group"
            tiltIntensity={5}
            onClick={() => navigate('/spare-change')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spare Change</h3>
              <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">Available to Invest</p>
              <motion.p
                className="text-4xl font-bold text-gradient-primary"
                key={availableSpareChange}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ₹{availableSpareChange.toFixed(2)}
              </motion.p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded-full bg-secondary">Round up to ₹{settings.roundUpCap || 10}</span>
                <span>•</span>
                <span>Total Invested: ₹{app.totalInvested.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
              <p className="text-xs text-center text-primary font-medium">Click to manage & invest</p>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2" tiltIntensity={3}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTransactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-primary/10"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date} · {tx.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">₹{tx.amount}</p>
                    <p className="text-xs text-success font-medium">+₹{tx.invested} invested</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
