/**
 * Simple Animated Background Component
 * CSS-only animated gradient background
 */

import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Main animated gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(0, 191, 255, 0.3), transparent),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(142, 71, 255, 0.25), transparent),
            radial-gradient(ellipse 700px 700px at 50% 50%, rgba(0, 255, 135, 0.2), transparent),
            linear-gradient(180deg, hsl(220, 20%, 7%) 0%, hsl(220, 22%, 10%) 100%)
          `,
                    animation: 'gradientShift 20s ease infinite',
                }}
            />

            {/* Floating orbs */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: `${300 + i * 150}px`,
                        height: `${300 + i * 150}px`,
                        background:
                            i === 0
                                ? 'radial-gradient(circle, rgba(0,191,255,0.4) 0%, rgba(0,191,255,0.1) 50%, transparent 70%)'
                                : i === 1
                                    ? 'radial-gradient(circle, rgba(142,71,255,0.3) 0%, rgba(142,71,255,0.1) 50%, transparent 70%)'
                                    : 'radial-gradient(circle, rgba(0,255,135,0.3) 0%, rgba(0,255,135,0.1) 50%, transparent 70%)',
                        filter: 'blur(60px)',
                        left: `${10 + i * 35}%`,
                        top: `${20 + i * 25}%`,
                    }}
                    animate={{
                        x: [0, 150, 0],
                        y: [0, -150, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 20 + i * 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 3,
                    }}
                />
            ))}

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 191, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.5) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Animated scan line */}
            <motion.div
                className="absolute left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0,191,255,0.6), transparent)',
                    boxShadow: '0 0 20px rgba(0,191,255,0.8)',
                }}
                animate={{
                    top: ['0%', '100%'],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />


        </div>
    );
};
