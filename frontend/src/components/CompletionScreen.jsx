import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Award, Star, Sparkles } from 'lucide-react';

export default function CompletionScreen({ progress }) {
  useEffect(() => {
    // Celebrate with confetti!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleClaimReward = () => {
    window.location.href = `https://blockquestofficial.com?progress=wallet_complete&xp=${progress.xp}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="p-8 md:p-12 space-y-6 relative overflow-hidden border-4 border-primary/30 shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 text-9xl">🏆</div>
            <div className="absolute top-20 right-10 text-9xl">⭐</div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-9xl">🎉</div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="inline-block"
              >
                <Trophy className="w-20 h-20 text-secondary mx-auto" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-adventure">
                Adventure Complete!
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-foreground">
                You're a Web3 Wallet Safety Expert! 🎓
              </p>
            </motion.div>

            {/* Stats Summary */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gradient-gold mb-1">{progress.xp}</div>
                    <p className="text-sm font-semibold text-muted-foreground">Total XP Earned</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Award className="w-8 h-8 text-secondary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-secondary mb-1">{progress.badges.length}</div>
                    <p className="text-sm font-semibold text-muted-foreground">Badges Collected</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-accent mb-1">{progress.completedLevels.length}</div>
                    <p className="text-sm font-semibold text-muted-foreground">Levels Mastered</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Badges Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="space-y-3">
                <h3 className="text-center font-bold text-lg text-foreground">Your Achievement Badges 🏅</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {progress.badges.map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                    >
                      <Badge
                        className="text-sm px-4 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                      >
                        🏆 {badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sam's Final Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 bg-primary/10 border-2 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0 animate-bounce">🧑‍🚀</div>
                  <div>
                    <p className="font-bold text-primary text-lg mb-2">Sam the Skeptic says:</p>
                    <p className="text-foreground/90 leading-relaxed">
                      "Incredible work, adventurer! You've learned all the important lessons about keeping your Web3 wallet safe.
                      Remember: never share your seed phrase, always check addresses before sending, and stay skeptical of scammers.
                      You're ready for the real crypto world! 🛡️🚀"
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-3"
            >
              <Button
                onClick={handleClaimReward}
                size="lg"
                className="w-full text-xl py-6 font-bold btn-adventure shadow-lg"
                style={{ background: 'var(--gradient-gold)' }}
              >
                🐐 Return to HQ & Claim Reward
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Your progress has been saved with {progress.xp} XP earned!
              </p>
            </motion.div>

            {/* What You Learned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="p-6 bg-accent/10 border-2 border-accent/30">
                <h3 className="font-bold text-accent text-center mb-4">🎓 What You've Mastered:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-foreground/80"><strong>Seed Phrases:</strong> How to protect your wallet's secret key</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-foreground/80"><strong>Receiving Coins:</strong> Understanding wallet addresses</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-foreground/80"><strong>Sending Safely:</strong> Spotting scammer addresses</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-foreground/80"><strong>Smart Contracts:</strong> How automatic promises work</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <p className="text-foreground/80"><strong>Decentralization:</strong> Why community voting matters</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🛡️</span>
                    <p className="text-foreground/80"><strong>Safety First:</strong> Always stay skeptical online!</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}