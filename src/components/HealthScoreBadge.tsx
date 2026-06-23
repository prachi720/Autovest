/**
 * Health Score Badge Component
 * Displays financial health score with color-coded state and trend indicator
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { getHealthScoreColor, getHealthScoreLabel } from '../services/financialScoring';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

interface HealthScoreBadgeProps {
    score: number;
    previousScore?: number;
    explanation?: string;
    size?: 'sm' | 'md' | 'lg';
    showTrend?: boolean;
}

export const HealthScoreBadge: React.FC<HealthScoreBadgeProps> = ({
    score,
    previousScore,
    explanation,
    size = 'md',
    showTrend = true,
}) => {
    const color = getHealthScoreColor(score);
    const label = getHealthScoreLabel(score);

    // Calculate trend
    const trend = previousScore ? score - previousScore : 0;
    const TrendIcon = trend > 2 ? TrendingUp : trend < -2 ? TrendingDown : Minus;
    const trendColor = trend > 2 ? 'text-success' : trend < -2 ? 'text-destructive' : 'text-muted-foreground';

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-3xl',
        lg: 'text-5xl',
    };

    return (
        <div className="flex items-center gap-3">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-2"
            >
                <span
                    className={`font-bold ${sizeClasses[size]}`}
                    style={{ color }}
                >
                    {score}
                </span>
                <span className="text-muted-foreground text-sm">/100</span>
            </motion.div>

            <div className="flex flex-col gap-1">
                <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color }}
                >
                    {label}
                </span>

                {showTrend && (
                    <div className={`flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon size={12} />
                        <span className="text-xs font-medium">
                            {trend > 0 ? `+${trend}` : trend < 0 ? trend : 'Stable'}
                        </span>
                    </div>
                )}
            </div>

            {explanation && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Info size={16} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                            <p className="text-xs whitespace-pre-line">{explanation}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};
