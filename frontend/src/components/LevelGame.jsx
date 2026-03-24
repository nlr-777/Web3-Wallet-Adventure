import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import SeedPhraseGame from './levels/SeedPhraseGame';
import ReceiveCoinsGame from './levels/ReceiveCoinsGame';
import SendSafelyGame from './levels/SendSafelyGame';
import SmartContractGame from './levels/SmartContractGame';
import DecentralizedEscapeGame from './levels/DecentralizedEscapeGame';
import IconSeedPhraseGame from './wallet/IconSeedPhraseGame';
import VaultStorageGame from './levels/VaultStorageGame';

export default function LevelGame({ level, onComplete, onBack }) {
  const renderGame = () => {
    switch (level.type) {
      case 'icon-seed-phrase':
        return <IconSeedPhraseGame level={level} onComplete={onComplete} />;
      case 'seed-phrase':
        return <SeedPhraseGame level={level} onComplete={onComplete} />;
      case 'receive-coins':
        return <ReceiveCoinsGame level={level} onComplete={onComplete} />;
      case 'send-safely':
        return <SendSafelyGame level={level} onComplete={onComplete} />;
      case 'smart-contract':
        return <SmartContractGame level={level} onComplete={onComplete} />;
      case 'vault-storage':
        return <VaultStorageGame level={level} onComplete={onComplete} />;
      case 'decentralized-escape':
        return <DecentralizedEscapeGame level={level} onComplete={onComplete} />;
      default:
        return <div>Level not found</div>;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--gradient-map)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="border-2 border-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{level.icon}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>{level.title}</h1>
              </div>
              <p className="mt-1" style={{ color: 'hsl(0 0% 75%)' }}>{level.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Sam's Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-primary/10 border-2 border-primary/30">
            <div className="flex items-start gap-3">
              <div className="text-3xl flex-shrink-0">🧑‍🚀</div>
              <div>
                <p className="font-bold text-primary text-sm">Sam says:</p>
                <p className="text-foreground italic">{level.samQuote}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Game Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderGame()}
        </motion.div>

        {/* Educational Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 border-2 border-accent/30" style={{ background: 'hsl(15 100% 60% / 0.1)' }}>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>{level.tip}</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}