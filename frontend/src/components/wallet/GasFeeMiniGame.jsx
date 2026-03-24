import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { GAS_LEVELS } from '../../lib/wallet';
import { toast } from 'sonner';

// Drag blocks mini-game
export default function GasFeeMiniGame({ onComplete, onSkip }) {
  const [gameType] = useState(Math.random() > 0.5 ? 'drag' : 'match3');
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedGas, setSelectedGas] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [targetBlocks, setTargetBlocks] = useState(0);
  const [draggedBlocks, setDraggedBlocks] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialize game based on type
    if (gameType === 'drag') {
      const gas = [GAS_LEVELS.LOW, GAS_LEVELS.MEDIUM, GAS_LEVELS.HIGH][Math.floor(Math.random() * 3)];
      setSelectedGas(gas);
      setTargetBlocks(gas.cost / 5); // Number of blocks to drag
      setBlocks(Array(10).fill(null).map((_, i) => ({ id: i, dragged: false })));
    } else {
      // Match-3 setup
      const icons = ['⛽', '🚀', '💎', '⚡'];
      setBlocks(Array(9).fill(null).map((_, i) => ({
        id: i,
        icon: icons[Math.floor(Math.random() * icons.length)],
        matched: false
      })));
    }

    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeout = () => {
    if (draggedBlocks >= targetBlocks || score >= 3) {
      toast.success('✅ Perfect! Bonus BQ earned!');
      onComplete(true, 50); // Bonus BQ
    } else {
      toast.info('⏳ Time\'s up! Still proceeding with your transaction.');
      onComplete(false, 0);
    }
  };

  const handleDragBlock = (blockId) => {
    if (draggedBlocks >= targetBlocks) return;
    
    setBlocks(prev => prev.map(b => 
      b.id === blockId ? { ...b, dragged: true } : b
    ));
    setDraggedBlocks(prev => prev + 1);

    if (draggedBlocks + 1 >= targetBlocks) {
      toast.success('✅ Perfect! Bonus BQ earned!');
      setTimeout(() => onComplete(true, 50), 500);
    }
  };

  const handleMatch = (blockId) => {
    const clickedBlock = blocks[blockId];
    const matches = blocks.filter(b => b.icon === clickedBlock.icon && !b.matched);
    
    if (matches.length >= 3) {
      setBlocks(prev => prev.map(b => 
        b.icon === clickedBlock.icon ? { ...b, matched: true } : b
      ));
      setScore(prev => prev + 1);

      if (score + 1 >= 3) {
        toast.success('✅ Perfect match! Bonus BQ earned!');
        setTimeout(() => onComplete(true, 50), 500);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6 space-y-4 border-2 border-secondary/30">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-4xl">🎮</div>
            <h3 className="text-xl font-bold text-gradient-neon">Gas Fee Mini-Game!</h3>
            <div className="flex items-center justify-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-secondary/20 border border-secondary">
                <p className="text-2xl font-black text-secondary">{timeLeft}s</p>
              </div>
              {gameType === 'drag' && (
                <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
                  Drag {targetBlocks} blocks to pay gas!
                </p>
              )}
              {gameType === 'match3' && (
                <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
                  Match 3 same icons!
                </p>
              )}
            </div>
          </div>

          {/* Drag Blocks Game */}
          {gameType === 'drag' && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  Dragged: {draggedBlocks}/{targetBlocks} 🧱
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {blocks.map(block => (
                  <motion.button
                    key={block.id}
                    onClick={() => handleDragBlock(block.id)}
                    disabled={block.dragged}
                    whileHover={{ scale: block.dragged ? 1 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`aspect-square rounded-lg text-3xl flex items-center justify-center transition-all ${
                      block.dragged
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-card border-2 border-border hover:border-primary'
                    }`}
                  >
                    {block.dragged ? '✓' : '🧱'}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Match-3 Game */}
          {gameType === 'match3' && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  Matches: {score}/3 ✨
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {blocks.map(block => (
                  <motion.button
                    key={block.id}
                    onClick={() => handleMatch(block.id)}
                    disabled={block.matched}
                    whileHover={{ scale: block.matched ? 1 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`aspect-square rounded-lg text-4xl flex items-center justify-center transition-all ${
                      block.matched
                        ? 'bg-success/20 border-2 border-success'
                        : 'bg-card border-2 border-border hover:border-primary'
                    }`}
                  >
                    {block.matched ? '✨' : block.icon}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Skip Button */}
          <Button
            variant="outline"
            onClick={() => onSkip()}
            className="w-full border-2 text-xs"
          >
            Skip Mini-Game (Still Proceed)
          </Button>

          <p className="text-xs text-center" style={{ color: 'hsl(0 0% 65%)' }}>
            🎯 Perfect completion = +50 bonus BQ!
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}