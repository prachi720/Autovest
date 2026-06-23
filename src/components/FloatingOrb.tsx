import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send } from 'lucide-react';

const predictionMap: Record<string, string> = {
  inv: 'Total invested today?',
  saf: 'Is my ₹5,000 buffer secure?',
  por: 'How is my portfolio doing?',
  goa: 'Am I on track for my goals?',
  bal: 'What is my current balance?',
};

const FloatingOrb: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const prediction = Object.entries(predictionMap).find(([key]) =>
    input.toLowerCase().startsWith(key)
  )?.[1];

  const chips = ['Portfolio summary', 'Buffer status', 'Today\'s investments'];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: `Based on your financial data, everything looks healthy. Your investments are growing steadily at 12.4% and your emergency buffer is well above the ₹5,000 safety threshold.` },
      ]);
    }, 600 + Math.random() * 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat"
            initial={{ scale: 0.5, opacity: 0, borderRadius: '50%' }}
            animate={{ scale: 1, opacity: 1, borderRadius: 'var(--radius)' }}
            exit={{ scale: 0.5, opacity: 0, borderRadius: '50%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="glass-panel w-80 sm:w-96 flex flex-col overflow-hidden"
            style={{ height: 440 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AutoVest AI</p>
                  <p className="text-xs text-muted-foreground">Always analyzing</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">How can I help you today?</p>
                  <div className="flex flex-wrap gap-2">
                    {chips.map(chip => (
                      <motion.button
                        key={chip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        onClick={() => sendMessage(chip)}
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm p-3 rounded-lg max-w-[85%] ${
                    msg.role === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-1.5 p-3">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/40"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border">
              {prediction && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-primary mb-2 hover:underline"
                  onClick={() => sendMessage(prediction)}
                >
                  💡 {prediction}
                </motion.button>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask AutoVest AI..."
                  className="flex-1 text-sm bg-secondary/50 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="orb"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full glass-panel flex items-center justify-center shadow-lg breathing-animation cursor-pointer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Brain size={22} className="text-primary" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingOrb;
