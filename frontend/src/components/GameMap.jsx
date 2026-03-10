import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Lock, CheckCircle, ArrowLeft, BarChart } from 'lucide-react';
import { LEVELS } from '../lib/levels';

export default function GameMap({ progress, onSelectLevel, onViewDashboard, onGameComplete }) {
  const totalLevels = LEVELS.length;
  const completedCount = progress.completedLevels.length;
  const completionPercent = (completedCount / totalLevels) * 100;

  useEffect(() => {
    if (completedCount === totalLevels) {
      onGameComplete();
    }
  }, [completedCount, totalLevels, onGameComplete]);

  const isLevelUnlocked = (levelId) => {
    return levelId <= progress.currentLevel;
  };

  const isLevelCompleted = (levelId) => {
    return progress.completedLevels.includes(levelId);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--gradient-map)' }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>Adventure Map 🗺️</h1>
            <p className="mt-1" style={{ color: 'hsl(0 0% 75%)' }}>Choose your next quest!</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={onViewDashboard}
              variant="outline"
              className="border-2 border-primary"
            >
              <BarChart className="w-4 h-4 mr-2" />
              Progress
            </Button>
            <a href="https://blockquestofficial.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BlockQuest HQ
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Progress Overview Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-primary/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Overall Progress</span>
                  <span className="text-lg font-bold text-primary">{completedCount}/{totalLevels} Levels</span>
                </div>
                <Progress value={completionPercent} className="h-3" />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-primary/10 rounded-xl border border-primary/30">
                  <div className="text-2xl font-bold text-primary">{progress.xp}</div>
                  <div className="text-xs" style={{ color: 'hsl(0 0% 75%)' }}>Total XP</div>
                </div>
                <div className="text-center px-4 py-2 bg-secondary/10 rounded-xl border border-secondary/30">
                  <div className="text-2xl font-bold text-secondary">{progress.badges.length}</div>
                  <div className="text-xs" style={{ color: 'hsl(0 0% 75%)' }}>Badges</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`p-6 h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
                    unlocked ? 'card-hover cursor-pointer border-2 border-primary/30' : 'opacity-60 cursor-not-allowed'
                  } ${completed ? 'bg-success/5 border-success/40' : ''}`}
                  onClick={() => unlocked && onSelectLevel(level)}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 text-8xl opacity-5 pointer-events-none">
                    {level.icon}
                  </div>

                  {/* Level number badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={completed ? 'default' : 'secondary'}
                      className={completed ? 'bg-success' : ''}
                    >
                      Level {level.id}
                    </Badge>
                  </div>

                  {/* Status icon */}
                  <div className="mb-4">
                    {completed ? (
                      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-success" />
                      </div>
                    ) : unlocked ? (
                      <div className="text-5xl animate-float">{level.icon}</div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{level.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>{level.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-foreground">+{level.xp} XP</span>
                    </div>
                    {completed ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        ✓ Complete
                      </Badge>
                    ) : unlocked ? (
                      <Badge className="bg-primary">Play Now</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Educational Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-accent/10 border-2 border-accent/30">
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">🧑‍🚀</div>
              <div>
                <p className="font-bold text-lg text-accent mb-2">Sam's Safety Tip:</p>
                <p className="text-foreground/80 leading-relaxed">
                  Complete each level to unlock the next adventure! Remember, Web3 is all about learning
                  and staying safe. Take your time and read the tips carefully! 🛡️
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}