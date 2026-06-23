import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import AuthBackground from '@/components/AuthBackground';

const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@autovest.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      login(email, password);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background */}
      <AuthBackground />

      <motion.div
        className="w-full max-w-md mx-4"
        style={{ perspective: 1000 }}
        animate={isTransitioning ? { scale: 1.15, opacity: 0, z: 100 } : {}}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <LoginCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={handleLogin}
          onSwitchToRegister={() => navigate('/register')}
        />
      </motion.div>
    </div>
  );
};

interface LoginCardProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToRegister: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  email, setEmail, password, setPassword,
  showPassword, setShowPassword, onSubmit, onSwitchToRegister,
}) => {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card-elevated p-8 space-y-6 border border-white/10 shadow-2xl shadow-primary/5"
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent font-display mb-2">AutoVest</h1>
        <p className="text-sm text-muted-foreground">Welcome back, investor</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Login
      </motion.button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-primary hover:text-primary/80 hover:underline font-medium transition-all">
          Register
        </button>
      </p>
    </motion.form>
  );
};

export default Login;
