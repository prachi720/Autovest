import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';

const Goals: React.FC = () => {
  const { goals } = useApp();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Goals</h2>
          <p className="text-muted-foreground mt-1">Track your financial milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal, i) => {
            const pct = (goal.current / goal.target) * 100;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <GlassCard tiltIntensity={10} depth={8}>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                      </div>
                      <span className="text-sm font-medium text-primary">{pct.toFixed(0)}%</span>
                    </div>

                    <div>
                      <div className="h-3 rounded-full bg-secondary overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-full bg-primary relative overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                        >
                          <div
                            className="absolute inset-0 opacity-30"
                            style={{
                              background: 'linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.4), transparent)',
                              backgroundSize: '200% 100%',
                              animation: 'lightSweep 3s ease-in-out infinite',
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ₹{goal.current.toLocaleString('en-IN')}
                      </span>
                      <span className="text-muted-foreground">
                        ₹{goal.target.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        {Math.round((goal.target - goal.current) / 500)} months to go at current pace
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Goals;
