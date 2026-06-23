import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { useApp } from '@/contexts/AppContext';

const Transactions: React.FC = () => {
  const { transactions } = useApp();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Transactions</h2>
          <p className="text-muted-foreground mt-1">Your complete investment ledger</p>
        </div>

        <GlassCard tiltIntensity={2}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {['Description', 'Category', 'Amount', 'Rounded To', 'Invested', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground pb-3 px-4 first:pl-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors group cursor-default"
                  >
                    <td className="py-3.5 px-4 first:pl-0 text-sm font-medium text-foreground">{tx.description}</td>
                    <td className="py-3.5 px-4 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-xs">{tx.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-foreground">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-sm text-muted-foreground">₹{tx.roundedTo.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-sm font-medium text-success group-hover:scale-105 transition-transform origin-left">
                      +₹{tx.invested}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-muted-foreground">{tx.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default Transactions;
