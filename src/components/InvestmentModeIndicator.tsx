/**
 * Investment Mode Indicator Component
 * Shows current adaptive investment mode with visual indicator
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Zap, Activity } from 'lucide-react';

interface InvestmentModeIndicatorProps {
    mode: 'Minimal' | 'Conservative' | 'Balanced' | 'Aggressive';
    percentage: number;
    reasoning?: string;
}

export const InvestmentModeIndicator: React.FC<InvestmentModeIndicatorProps> = ({
    mode,
    percentage,
    reasoning,
}) => {
    const modeConfig = {
        Minimal: {
            icon: Shield,
            color: 'hsl(0, 84%, 60%)',
            bgColor: 'hsl(0, 84%, 60%, 0.1)',
            description: 'Safety first',
        },
        Conservative: {
            icon: Activity,
            color: 'hsl(38, 92%, 50%)',
            bgColor: 'hsl(38, 92%, 50%, 0.1)',
            description: 'Cautious growth',
        },
        Balanced: {
            icon: TrendingUp,
            color: 'hsl(193, 100%, 50%)',
            bgColor: 'hsl(193, 100%, 50%, 0.1)',
            description: 'Steady progress',
        },
        Aggressive: {
            icon: Zap,
            color: 'hsl(142, 71%, 45%)',
            bgColor: 'hsl(142, 71%, 45%, 0.1)',
            description: 'Maximum growth',
        },
    };

    // Fallback to Balanced if mode is invalid
    const config = modeConfig[mode] || modeConfig.Balanced;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-xl border"
            style={{
                backgroundColor: config.bgColor,
                borderColor: config.color,
            }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: config.color }}
                >
                    <Icon size={20} className="text-white" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{mode} Mode</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium" style={{ color: config.color }}>
                            {percentage}% invested
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                </div>
            </div>

            {reasoning && (
                <p className="text-xs text-muted-foreground mt-3 pl-13 leading-relaxed">
                    {reasoning}
                </p>
            )}
        </motion.div>
    );
};
