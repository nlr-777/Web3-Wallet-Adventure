import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, Zap } from 'lucide-react';
import { GAS_LEVELS } from '../../lib/wallet';

export default function GasFeeSelector({ onSelect, onCancel }) {
  const [selectedGas, setSelectedGas] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);

  const gasOptions = [GAS_LEVELS.LOW, GAS_LEVELS.MEDIUM, GAS_LEVELS.HIGH];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 space-y-6 border-2 border-primary/30">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="text-5xl mb-2">⛽</div>
            <h2 className="text-2xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Choose Your Gas Fee
            </h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>Pick how fast you want your transaction!</p>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-4 border-2 border-secondary/30" style={{ background: 'hsl(325 100% 50% / 0.1)' }}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="font-bold text-secondary text-sm">What's Gas Fee? 🤔</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>
                        Gas fees are like shipping costs! <strong className="text-primary">Low gas</strong> = cheaper but slower (like turtle mail 🐢). 
                        <strong className="text-accent"> High gas</strong> = costs more but super fast (rocket speed 🚀)! 
                        The transaction still works either way, you just choose the speed!
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowExplanation(false)}
                        className="text-xs text-secondary"
                      >
                        Got it! ✓
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gas Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gasOptions.map((gas, index) => (
              <motion.button
                key={gas.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGas(gas)}
                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedGas?.name === gas.name
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {selectedGas?.name === gas.name && (
                  <motion.div
                    layoutId="gas-selected"
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Zap className="w-4 h-4 text-background" fill="currentColor" />
                  </motion.div>
                )}

                <div className="space-y-3 text-center">
                  <motion.div
                    className="text-5xl"
                    animate={selectedGas?.name === gas.name ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {gas.emoji}
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg" style={{ color: gas.color }}>{gas.name}</p>
                    <p className="text-2xl font-black text-foreground">{gas.cost} BQ</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: 'hsl(0 0% 75%)' }}>Confirm Time:</p>
                    <p className="text-sm font-semibold text-accent">~{gas.time}s</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedGas && onSelect(selectedGas)}
              disabled={!selectedGas}
              className="flex-1 btn-retro"
              style={{
                background: selectedGas ? 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))' : undefined,
                border: '2px solid hsl(180 100% 50% / 0.5)'
              }}
            >
              Confirm Gas Fee
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}