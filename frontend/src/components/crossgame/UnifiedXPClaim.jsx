import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Trophy, Zap, Star, ArrowRight } from 'lucide-react';
import { GAMES } from '../../lib/useCrossGameWallet';

export default function UnifiedXPClaim({ xpData, onClaim, onClose }) {
  const { game, xp, reason, badge, additionalRewards } = xpData;

  const handleClaim = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00D4FF', '#FF00B8', '#FF6B35', '#00FF88']
    });

    if (onClaim) onClaim(xpData);
  };

  const getGameInfo = (gameId) => {
    switch(gameId) {
      case GAMES.WALLET_ADVENTURE:
        return { name: 'Wallet Adventure', emoji: '👛', color: 'hsl(180 100% 50%)' };
      case GAMES.STUDIO:
        return { name: 'BlockQuest Studio', emoji: '🎨', color: 'hsl(270 100% 60%)' };
      case GAMES.MAIN_HUB:
        return { name: 'BlockQuest HQ', emoji: '🏠', color: 'hsl(150 100% 50%)' };
      default:
        return { name: gameId, emoji: '🎮', color: 'hsl(45 95% 60%)' };
    }
  };

  const gameInfo = getGameInfo(game);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 space-y-6 border-4 border-primary/30 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary blur-3xl animate-pulse"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <div className="text-7xl">{gameInfo.emoji}</div>
              </motion.div>
              <h2 className="text-3xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Quest Complete!
              </h2>
              <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
                {gameInfo.name}
              </p>
            </div>

            {/* XP Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Card className="p-6 text-center relative overflow-hidden" style={{
                background: `linear-gradient(135deg, ${gameInfo.color}15 0%, ${gameInfo.color}05 100%)`,
                border: `2px solid ${gameInfo.color}40`
              }}>
                <div className="absolute top-0 right-0 text-8xl opacity-5">🏆</div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-6 h-6" style={{ color: gameInfo.color }} />
                    <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>XP Earned</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="text-6xl font-black text-gradient-neon mb-2"
                  >
                    +{xp}
                  </motion.div>
                  {reason && (
                    <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>{reason}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-4 bg-secondary/10 border-2 border-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Badge Unlocked</p>
                      <p className="text-lg font-bold text-secondary">{badge}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Additional Rewards */}
            {additionalRewards && additionalRewards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <p className="text-xs font-semibold text-center" style={{ color: 'hsl(0 0% 75%)' }}>
                  Bonus Rewards:
                </p>
                {additionalRewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Card className="p-3 bg-accent/5 border border-accent/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-accent" />
                          <span className="text-sm font-semibold text-foreground">{reward.name}</span>
                        </div>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                          {reward.value}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Claim Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleClaim}
                className="w-full btn-retro text-lg"
                size="lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))',
                  border: '2px solid hsl(180 100% 50% / 0.5)'
                }}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Claim Rewards
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Cross-game info */}
            <p className="text-xs text-center" style={{ color: 'hsl(0 0% 65%)' }}>
              🌐 Your XP is synced across all BlockQuest games
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}