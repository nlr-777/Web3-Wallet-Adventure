import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowDownToLine, Clock, CheckCircle, Loader, Download } from 'lucide-react';
import { exportTransactionHistory, formatBQTokens } from '../../lib/wallet';
import { toast } from 'sonner';

export default function TransactionHistory({ transactions }) {
  const [filter, setFilter] = useState('all'); // all, send, vault, reward

  const handleExport = () => {
    const content = exportTransactionHistory(transactions);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-wallet-diary.txt';
    a.click();
    toast.success('📝 Wallet Diary exported!');
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'send': return 'hsl(15 100% 60%)';
      case 'vault': return 'hsl(270 100% 60%)';
      case 'reward': return 'hsl(150 100% 50%)';
      default: return 'hsl(180 100% 50%)';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === 'pending') return <Loader className="w-4 h-4 text-accent animate-spin" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Transaction History 📜
        </h3>
        <Button
          onClick={handleExport}
          disabled={transactions.length === 0}
          size="sm"
          variant="outline"
          className="border-2 border-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Diary
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'send', 'vault', 'reward'].map(f => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            className={filter === f ? 'bg-primary' : 'border-2'}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed border-border">
          <div className="text-6xl mb-4 opacity-30">📎</div>
          <p style={{ color: 'hsl(0 0% 65%)' }}>No transactions yet. Start your wallet adventure!</p>
        </Card>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:bg-card/80 transition-all border-2 border-border hover:border-primary/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge style={{ backgroundColor: getTypeColor(tx.type) }}>
                        {tx.type.toUpperCase()}
                      </Badge>
                      {getStatusIcon(tx.status)}
                      <span className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>Amount:</span>
                        <p className="font-semibold text-secondary">{formatBQTokens(tx.amount)}</p>
                      </div>
                      <div>
                        <span className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>Gas Fee:</span>
                        <p className="font-semibold text-accent">{formatBQTokens(tx.gasCost)}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs" style={{ color: 'hsl(0 0% 65%)' }}>To:</span>
                        <p className="font-semibold text-foreground text-sm">{tx.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-primary font-mono">
                        {tx.txHash.slice(0, 20)}...{tx.txHash.slice(-10)}
                      </code>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}