import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Eye, EyeOff, Check } from 'lucide-react';
import AuthBackground from '@/components/AuthBackground';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useApp();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      register(name || 'Demo User', email || 'demo@autovest.com', password);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <AuthBackground />

      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card-elevated p-8 w-full max-w-md mx-4 space-y-6 border border-white/10 shadow-2xl shadow-primary/5"
      >
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center"
            >
              <Check size={32} className="text-success" />
            </motion.div>
            <p className="text-lg font-semibold text-foreground">Account Created!</p>
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          </motion.div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-accent font-display mb-2">Create Account</h1>
              <p className="text-sm text-muted-foreground">Start your investment journey</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'John Doe' },
                { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
              ].map(field => (
                <div key={field.label} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              {[
                { label: 'Password', value: password, setter: setPassword },
                { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword },
              ].map(field => (
                <div key={field.label} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
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
              ))}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Create Account
            </motion.button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/')} className="text-primary hover:text-primary/80 hover:underline font-medium transition-all">
                Login
              </button>
            </p>
          </>
        )}
      </motion.form>
    </div>
  );
};

export default Register;
