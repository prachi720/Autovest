import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const growthData: Record<string, { name: string; value: number }[]> = {
  '1D': Array.from({ length: 24 }, (_, i) => ({ name: `${i}h`, value: 4200 + Math.sin(i / 3) * 150 + i * 10 })),
  '1W': Array.from({ length: 7 }, (_, i) => ({ name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], value: 4000 + i * 60 + Math.random() * 100 })),
  '1M': Array.from({ length: 30 }, (_, i) => ({ name: `${i + 1}`, value: 3500 + i * 30 + Math.sin(i / 5) * 200 })),
  '1Y': Array.from({ length: 12 }, (_, i) => ({ name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], value: 1000 + i * 300 + Math.sin(i / 2) * 400 })),
};

const allocationData = [
  { name: 'Stocks', value: 45, color: 'hsl(193, 100%, 50%)' },
  { name: 'Bonds', value: 25, color: 'hsl(225, 100%, 68%)' },
  { name: 'Gold', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Crypto', value: 15, color: 'hsl(142, 71%, 45%)' },
];

const Portfolio: React.FC = () => {
  const [period, setPeriod] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Portfolio</h2>
          <p className="text-muted-foreground mt-1">Track your investment performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <GlassCard className="lg:col-span-2" tiltIntensity={3}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">Growth</h3>
              <div className="flex gap-1">
                {(['1D', '1W', '1M', '1Y'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      period === p
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <motion.div
              key={period}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={growthData[period]}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(193, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 13%, 63%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 13%, 63%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsla(220, 22%, 10%, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid hsla(220, 16%, 20%, 0.5)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                      fontSize: 12,
                      color: 'hsl(213, 27%, 90%)',
                    }}
                    formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(193, 100%, 50%)"
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                    activeDot={{ r: 5, fill: 'hsl(193, 100%, 50%)', strokeWidth: 2, stroke: 'hsl(220, 20%, 7%)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </GlassCard>

          {/* Allocation Pie */}
          <GlassCard tiltIntensity={6}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Allocation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, i) => setActiveSlice(i)}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  {allocationData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={activeSlice === null || activeSlice === i ? 1 : 0.3}
                      style={{ transition: 'opacity 0.3s, transform 0.3s' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {allocationData.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between text-sm transition-opacity ${
                    activeSlice !== null && activeSlice !== i ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default Portfolio;
