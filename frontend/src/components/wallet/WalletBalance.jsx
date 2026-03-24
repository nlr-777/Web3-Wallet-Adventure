import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Wallet, TrendingUp } from 'lucide-react';
import { formatBQTokens } from '../../lib/wallet';

export default function WalletBalance({ balance, totalGasSpent }) {
  return (
    <Card className="p-4 border-2 border-primary/30" style={{ background: 'linear-gradient(135deg, hsl(180 100% 50% / 0.1), hsl(270 100% 60% / 0.1))' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
          >
            <Wallet className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <p className="text-xs" style={{ color: 'hsl(0 0% 75%)' }}>Your Wallet Balance</p>
            <p className="text-2xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {formatBQTokens(balance)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs" style={{ color: 'hsl(0 0% 75%)' }}>
            <TrendingUp className="w-3 h-3" />
            <span>Gas Spent</span>
          </div>
          <p className="text-sm font-bold text-accent">{formatBQTokens(totalGasSpent)}</p>
        </div>
      </div>
    </Card>
  );
}