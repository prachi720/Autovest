/**
 * Landing Page Component
 * Professional landing page showcasing AutoVest features
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Shield, TrendingUp, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
    const features = [
        {
            icon: Brain,
            title: 'AI Financial Health Score',
            description: 'Dynamic 0-100 scoring system that analyzes your spending patterns, emergency buffer, and subscription burden in real-time.',
            color: 'hsl(193, 100%, 50%)',
        },
        {
            icon: Shield,
            title: 'Smart Subscription Leak Detection',
            description: 'Automatically identifies unused subscriptions and calculates potential monthly savings to optimize your finances.',
            color: 'hsl(38, 92%, 50%)',
        },
        {
            icon: TrendingUp,
            title: 'Adaptive Investment Engine',
            description: 'AI adjusts investment strategy based on your financial health - from minimal to aggressive modes. Set budget limits to ensure AI never invests more than you\'re comfortable with.',
            color: 'hsl(142, 71%, 45%)',
        },
        {
            icon: Zap,
            title: 'Automatic Spare Change Investing',
            description: 'Rounds up every transaction and invests the difference automatically, building wealth effortlessly.',
            color: 'hsl(225, 100%, 68%)',
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Logo/Brand */}
                        <motion.div
                            className="inline-block mb-6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-success">
                                AutoVest
                            </h1>
                        </motion.div>

                        {/* Headline */}
                        <motion.h2
                            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Your Financial System<br />
                            <span className="text-gradient-primary">That Thinks for You</span>
                        </motion.h2>

                        {/* Tagline */}
                        <motion.p
                            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            Turn Everyday Spending Into Intelligent Growth
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <Link to="/register">
                                <motion.button
                                    className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started Free
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="button-bg"
                                    />
                                </motion.button>
                            </Link>

                            <Link to="/login">
                                <motion.button
                                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg border border-border hover:border-primary transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Login
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-success" />
                                <span>Bank-Level Security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-success" />
                                <span>Privacy-First Design</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-success" />
                                <span>AI-Powered Insights</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                            Intelligent Features That Work For You
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Advanced AI technology combined with simple automation to help you build wealth effortlessly
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border hover:border-primary/50 transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -8 }}
                            >
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${feature.color}20` }}
                                >
                                    <feature.icon size={28} style={{ color: feature.color }} />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Preview Section */}
            <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent to-background/50">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                            See Your Financial Health at a Glance
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            Real-time AI analysis of your financial wellness
                        </p>
                    </motion.div>

                    <motion.div
                        className="relative p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-border shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Financial Score */}
                            <div className="text-center p-6 rounded-2xl bg-primary/10 border border-primary/20">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Financial Health Score</p>
                                <div className="text-6xl font-bold text-primary mb-2">82</div>
                                <p className="text-sm text-muted-foreground">/100</p>
                                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                                    Excellent
                                </div>
                            </div>

                            {/* Investment Mode */}
                            <div className="text-center p-6 rounded-2xl bg-accent/10 border border-accent/20">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Investment Mode</p>
                                <div className="text-4xl font-bold text-accent mb-2">Balanced</div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Investing 65% of spare change
                                </p>
                                <div className="mt-4 w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent rounded-full"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '65%' }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                    />
                                </div>
                            </div>

                            {/* Leak Risk */}
                            <div className="text-center p-6 rounded-2xl bg-success/10 border border-success/20">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Subscription Leak Risk</p>
                                <div className="text-4xl font-bold text-success mb-2">Low</div>
                                <p className="text-sm text-muted-foreground mt-4">
                                    All subscriptions actively used
                                </p>
                                <div className="mt-4 inline-block px-4 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                                    ✓ Optimized
                                </div>
                            </div>
                        </div>

                        {/* AI Insight */}
                        <motion.div
                            className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">🤖 AI Insight:</span> Your financial health is excellent!
                                Strong emergency buffer and stable spending patterns allow for balanced investment strategy.
                                Continue current habits to maximize returns.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="text-2xl font-bold text-gradient-primary mb-3">AutoVest</h4>
                            <p className="text-muted-foreground mb-4">
                                AI-powered spare change investing platform that helps you build wealth automatically
                                while maintaining complete control over your finances.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h5 className="font-semibold text-foreground mb-3">Product</h5>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold text-foreground mb-3">Company</h5>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
                        <p>&copy; 2024 AutoVest. All rights reserved. Built with AI-powered intelligence.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
