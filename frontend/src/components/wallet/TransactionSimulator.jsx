import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Clock, ExternalLink, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function TransactionSimulator({ transaction, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('pending'); // pending, confirming, confirmed
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Simulate transaction confirmation
    const totalTime = transaction.confirmTime * 1000; // Convert to ms
    const interval = 100; // Update every 100ms
    const increment = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setElapsed(prev => prev + 0.1);
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          setStatus('confirmed');
          confetti({
            particleCount: transaction.gasLevel === 'High' ? 150 : 100,
            spread: transaction.gasLevel === 'High' ? 100 : 70,
            origin: { y: 0.6 }
          });
          toast.success(`🎉 Transaction Confirmed! Hash: ${transaction.txHash.slice(0, 10)}...`);
          setTimeout(() => onComplete(), 2000);
          return 100;
        }
        if (newProgress > 30 && status === 'pending') {
          setStatus('confirming');
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const getSpeedAnimation = () => {
    switch (transaction.gasLevel) {
      case 'Low':
        return { duration: 3, repeat: Infinity };
      case 'Medium':
        return { duration: 1.5, repeat: Infinity };
      case 'High':
        return { duration: 0.5, repeat: Infinity };
      default:
        return { duration: 2, repeat: Infinity };
    }
  };

  const getStatusEmoji = () => {
    if (status === 'confirmed') return '✅';
    if (status === 'confirming') return '🔄';
    return '⏳';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 space-y-6 border-2 border-primary/30">
          {/* Status */}
          <div className="text-center space-y-3">
            <motion.div
              className="text-7xl"
              animate={status === 'confirmed' ? { scale: [1, 1.2, 1] } : { rotate: 360 }}
              transition={status === 'confirmed' ? { duration: 0.5 } : getSpeedAnimation()}
            >
              {getStatusEmoji()}
            </motion.div>
            <h2 className="text-2xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              {status === 'confirmed' ? 'Transaction Confirmed!' : 'Processing Transaction...'}
            </h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
              {status === 'confirmed' 
                ? 'Your transaction is complete and recorded on the blockchain!' 
                : `Using ${transaction.gasLevel} gas speed...`}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'hsl(0 0% 75%)' }}>Confirmation Progress</span>
              <span className="font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden border-2 border-primary/30">
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, hsl(180 100% 50%), hsl(325 100% 50%))',
                  width: `${progress}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'hsl(0 0% 75%)' }}>
              <Clock className="w-3 h-3" />
              <span>Elapsed: {elapsed.toFixed(1)}s / ~{transaction.confirmTime}s</span>
            </div>
          </div>

          {/* Transaction Details */}
          <Card className="p-4 bg-card/50 space-y-3">
            <h3 className="font-bold text-primary text-sm">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'hsl(0 0% 75%)' }}>Type:</span>
                <span className="font-semibold text-foreground uppercase">{transaction.type}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'hsl(0 0% 75%)' }}>Amount:</span>
                <span className="font-semibold text-secondary">{transaction.amount} BQ</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'hsl(0 0% 75%)' }}>Recipient:</span>
                <span className="font-semibold text-foreground">{transaction.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'hsl(0 0% 75%)' }}>Gas Fee:</span>
                <span className="font-semibold text-accent">{transaction.gasCost} BQ</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'hsl(0 0% 75%)' }}>TX Hash:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-primary font-mono">
                    {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
                  </code>
                </div>
              </div>
            </div>
          </Card>

          {/* Explorer Button */}
          {status === 'confirmed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={() => {
                  toast.success('Opening Block Explorer... (simulated)');
                  // In real app, would open explorer
                }}
                className="w-full btn-retro"
                style={{
                  background: 'linear-gradient(135deg, hsl(180 100% 50%), hsl(270 100% 60%))',
                  border: '2px solid hsl(325 100% 50% / 0.5)'
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Block Explorer
              </Button>
            </motion.div>
          )}

          {/* Fun Messages based on gas speed */}
          <AnimatePresence>
            {status === 'confirming' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-xs italic" style={{ color: 'hsl(0 0% 65%)' }}>
                  {transaction.gasLevel === 'Low' && '🐢 Taking it slow and steady...'}
                  {transaction.gasLevel === 'Medium' && '🚗 Cruising along nicely...'}
                  {transaction.gasLevel === 'High' && '🚀 Lightning fast confirmation!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}