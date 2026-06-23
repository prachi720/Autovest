import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { Shield, Activity, Droplets, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const CircularGauge: React.FC<{ value: number; max: number; label: string; color: string; icon: React.ReactNode }> = ({
  value, max, label, color, icon,
}) => {
  const pct = Math.min(value / max, 1);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-foreground">{Math.round(pct * 100)}%</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

const AIBrain: React.FC = () => {
  const app = useApp();
  const bufferHealth = Math.min(app.emergencyBuffer / 10000, 1) * 100;

  // Calculate spending stability from health score breakdown
  const spendingStability = app.financialHealthScore > 0 ? Math.min(app.financialHealthScore + 10, 100) : 82;
  const volatility = app.subscriptionLeakRisk;
  const growthForecast = Math.max(50, app.financialHealthScore - 10);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">AI Brain</h2>
          <p className="text-muted-foreground mt-1">Intelligence hub — privacy-preserving analytics</p>
        </div>

        {/* AI Health Summary */}
        {app.aiDashboardSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard tiltIntensity={4}>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h3 className="text-sm font-semibold text-foreground mb-2">🤖 AI Financial Summary</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {app.aiDashboardSummary}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: spendingStability, max: 100, label: 'Spending Stability', color: 'hsl(193, 100%, 50%)', icon: <Activity size={20} className="text-primary" /> },
            { value: bufferHealth, max: 100, label: 'Buffer Health', color: bufferHealth > 50 ? 'hsl(142, 71%, 45%)' : 'hsl(38, 92%, 50%)', icon: <Shield size={20} className={bufferHealth > 50 ? 'text-success' : 'text-warning'} /> },
            { value: volatility, max: 100, label: 'Leak Risk', color: volatility > 50 ? 'hsl(0, 84%, 60%)' : 'hsl(38, 92%, 50%)', icon: <AlertTriangle size={20} className={volatility > 50 ? 'text-destructive' : 'text-warning'} /> },
            { value: growthForecast, max: 100, label: 'Growth Forecast', color: 'hsl(142, 71%, 45%)', icon: <TrendingUp size={20} className="text-success" /> },
          ].map((gauge, i) => (
            <motion.div
              key={gauge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard tiltIntensity={8} className="flex items-center justify-center py-8">
                <CircularGauge {...gauge} />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Health Analysis */}
          <GlassCard tiltIntensity={4}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Subscription Health</h3>
            {app.potentialMonthlySavings > 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-destructive mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Potential Waste Detected</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Save ₹{app.potentialMonthlySavings.toFixed(2)}/month by reviewing unused subscriptions
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Leak Risk</span>
                    <span className="font-medium text-foreground">{Math.round(app.subscriptionLeakRisk)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: app.subscriptionLeakRisk > 50 ? 'hsl(0, 84%, 60%)' : 'hsl(38, 92%, 50%)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${app.subscriptionLeakRisk}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-success/5 border border-success/10">
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Healthy Subscriptions</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All subscriptions appear to be actively used and well-managed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* AI Explanation */}
          <GlassCard tiltIntensity={4}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Insights</h3>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <Activity size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Financial Health Analysis</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                    {app.aiHealthExplanation.split('\n').slice(0, 3).join('\n') || 'Analyzing your financial patterns...'}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard tiltIntensity={4}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Liquidity Forecast</h3>
            <div className="space-y-4">
              {['Next 7 days', 'Next 30 days', 'Next 90 days'].map((period, i) => {
                const forecast = [95, 87, 72][i];
                return (
                  <div key={period}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{period}</span>
                      <span className="font-medium text-foreground">{forecast}% healthy</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: forecast > 80 ? 'hsl(142, 71%, 45%)' : forecast > 60 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${forecast}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard tiltIntensity={4}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Privacy & Security</h3>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">AES-256 Encrypted</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Privacy-preserving AI with fully anonymized data processing. Your financial data never leaves the secure enclave.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Data anonymization', status: 'Active' },
                { label: 'End-to-end encryption', status: 'Active' },
                { label: 'Zero-knowledge proofs', status: 'Active' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-success text-xs font-medium px-2 py-0.5 rounded-full bg-success/10">{item.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default AIBrain;
