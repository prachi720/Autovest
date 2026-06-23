import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';
import { Shield, Lock, Eye, Brain } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { settings, updateSetting } = useApp();

  const toggles = [
    { key: 'biometrics' as const, label: 'Biometric Authentication', desc: 'Use fingerprint or face ID', icon: Shield },
    { key: 'encryption' as const, label: 'End-to-End Encryption', desc: 'AES-256 data protection', icon: Lock },
    { key: 'privacyMode' as const, label: 'Privacy Mode', desc: 'Hide sensitive amounts', icon: Eye },
  ];

  const aiLevels = [
    { value: 'basic', label: 'Basic', desc: 'Minimal AI insights' },
    { value: 'advanced', label: 'Advanced', desc: 'Detailed analytics' },
    { value: 'full', label: 'Full', desc: 'Complete AI intelligence' },
  ];

  return (
    <Layout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Settings</h2>
          <p className="text-muted-foreground mt-1">Security & preferences</p>
        </div>

        <GlassCard tiltIntensity={3}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Security</h3>
          <div className="space-y-4">
            {toggles.map((toggle, i) => (
              <motion.div
                key={toggle.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <toggle.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                    <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(toggle.key, !settings[toggle.key])}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                    settings[toggle.key] ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm"
                    animate={{ left: settings[toggle.key] ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard tiltIntensity={3}>
          <div className="flex items-center gap-2 mb-5">
            <Brain size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Insight Level</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {aiLevels.map(level => (
              <button
                key={level.value}
                onClick={() => updateSetting('aiInsightLevel', level.value)}
                className={`p-4 rounded-xl text-left transition-all ${
                  settings.aiInsightLevel === level.value
                    ? 'bg-primary/10 border-2 border-primary/30'
                    : 'bg-secondary/30 border-2 border-transparent hover:bg-secondary/50'
                }`}
              >
                <p className="text-sm font-medium text-foreground">{level.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{level.desc}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard tiltIntensity={3}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Lock size={18} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-foreground">Encryption Active</p>
              <p className="text-xs text-muted-foreground">All data protected with AES-256 encryption</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default SettingsPage;
