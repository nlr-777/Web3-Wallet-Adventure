import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Award } from 'lucide-react';

export default function ProgressDashboard({ progress, onBack }) {
  const totalXP = 300; // 5 levels * 60 XP
  const xpPercentage = (progress.xp / totalXP) * 100;
  const totalLevels = 5;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4"
        >
          <Button
            onClick={onBack}
            variant="outline"
            size="icon"
            className="border-2 border-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-adventure">Progress Dashboard 📊</h1>
            <p className="text-muted-foreground mt-1">Track your adventure achievements</p>
          </div>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-5 pointer-events-none">🏆</div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-secondary" />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Total XP Earned</h2>
                    <p className="text-muted-foreground text-sm">Keep completing levels to earn more!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gradient-gold">{progress.xp}</div>
                  <div className="text-sm text-muted-foreground">/ {totalXP} XP</div>
                </div>
              </div>
              <Progress value={xpPercentage} className="h-4" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(xpPercentage)}% Complete
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="p-6 text-center bg-primary/10 border-2 border-primary/30">
            <div className="text-5xl mb-3 animate-bounce">🎯</div>
            <div className="text-3xl font-bold text-primary mb-1">{progress.completedLevels.length}</div>
            <p className="text-sm text-muted-foreground">Levels Completed</p>
            <p className="text-xs text-muted-foreground mt-1">out of {totalLevels} total</p>
          </Card>

          <Card className="p-6 text-center bg-secondary/10 border-2 border-secondary/30">
            <div className="text-5xl mb-3 animate-float">🏅</div>
            <div className="text-3xl font-bold text-secondary mb-1">{progress.badges.length}</div>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
            <p className="text-xs text-muted-foreground mt-1">Collect them all!</p>
          </Card>

          <Card className="p-6 text-center bg-accent/10 border-2 border-accent/30">
            <div className="text-5xl mb-3">⭐</div>
            <div className="text-3xl font-bold text-accent mb-1">{progress.currentLevel}</div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-xs text-muted-foreground mt-1">Next to unlock</p>
          </Card>
        </motion.div>

        {/* Badges Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Badge Collection 🏆</h2>
            </div>
            {progress.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {progress.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                  >
                    <Card className="p-4 bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-primary/40">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">
                          🏅
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-lg">{badge}</p>
                          <p className="text-sm text-muted-foreground">Level {index + 1} Achievement</p>
                        </div>
                        <Badge className="bg-success">Earned</Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 opacity-30">🏆</div>
                <p className="text-muted-foreground">Complete levels to earn badges!</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Achievements Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-accent/10 border-2 border-accent/30">
            <div className="text-center space-y-3">
              <div className="text-4xl">🧑‍🚀</div>
              <p className="font-bold text-accent text-lg">Sam's Encouragement</p>
              <p className="text-foreground/80 leading-relaxed">
                {progress.completedLevels.length === 0
                  ? "Start your adventure and learn how to keep your wallet safe! Every level teaches you something important about Web3."
                  : progress.completedLevels.length === totalLevels
                  ? "Amazing work, adventurer! You've mastered all the Web3 wallet safety lessons. You're ready for the real world!"
                  : `Great progress! You've completed ${progress.completedLevels.length} out of ${totalLevels} levels. Keep going to become a Web3 safety expert!`}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Button
            onClick={onBack}
            className="flex-1 btn-adventure"
            size="lg"
            style={{ background: 'var(--gradient-button)' }}
          >
            🗺️ Back to Map
          </Button>
          <a href={process.env.REACT_APP_BLOCKQUEST_URL || "https://blockquestofficial.com"} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full border-2" size="lg">
              🏠 BlockQuest HQ
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}