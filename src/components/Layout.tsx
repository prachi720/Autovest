import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, PieChart, Receipt, Brain, Target, CreditCard, Zap, Settings, LogOut, Coins } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useMouse } from '@/contexts/MouseContext';
import FloatingOrb from '@/components/FloatingOrb';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { to: '/transactions', icon: Receipt, label: 'Transactions' },
  { to: '/ai-brain', icon: Brain, label: 'AI Brain' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/micro-investments', icon: Zap, label: 'Micro Investments' },
  { to: '/spare-change', icon: Coins, label: 'Spare Change' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, safetyLockActive } = useApp();
  const mouse = useMouse();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${safetyLockActive ? 'safety-lock-active' : ''}`}>
      {/* Parallax background layer */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, hsla(193, 100%, 50%, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(225, 100%, 68%, 0.03) 0%, transparent 50%)',
        }}
        animate={{
          x: mouse.normalizedX * 10,
          y: mouse.normalizedY * 10,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />

      {/* Safety Lock Banner */}
      {safetyLockActive && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-warning/10 border-b border-warning/20 px-4 py-2 text-center"
        >
          <p className="text-sm font-medium text-warning">
            🛑 Safety Lock Active — Auto-invest paused to protect liquidity.
          </p>
        </motion.div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass-panel rounded-none border-r border-border/50 z-40 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gradient-primary font-display tracking-tight">AutoVest</h1>
          <p className="text-xs text-muted-foreground mt-1">Intelligent Investing</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {user.name.charAt(0) || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name || 'Demo User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full px-3 py-2 rounded-lg hover:bg-destructive/5"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`ml-64 min-h-screen ${safetyLockActive ? 'pt-14' : ''}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>

      <FloatingOrb />
    </div>
  );
};

export default Layout;
