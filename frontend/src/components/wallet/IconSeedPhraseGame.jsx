import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Lock } from 'lucide-react';
import { SEED_ICONS, generateRandomPhrase, saveSeedPhrase } from '../../lib/seedPhraseIcons';
import { toast } from 'sonner';

export default function IconSeedPhraseGame({ level, onComplete }) {
  const [step, setStep] = useState('create'); // create, review, test
  const [seedPhrase, setSeedPhrase] = useState([]);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [testPhrase, setTestPhrase] = useState([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Generate a random phrase
    const phrase = generateRandomPhrase();
    setSeedPhrase(phrase);
  }, []);

  const handleIconSelect = (icon) => {
    if (selectedIcons.length >= 12) return;
    
    const newSelected = [...selectedIcons, icon];
    setSelectedIcons(newSelected);

    if (newSelected.length === 12) {
      // Move to review
      setTimeout(() => {
        setStep('review');
        toast.success('🎉 Your seed phrase is ready!');
      }, 500);
    }
  };

  const handleRemoveIcon = (index) => {
    setSelectedIcons(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmPhrase = () => {
    saveSeedPhrase(selectedIcons);
    setSeedPhrase(selectedIcons);
    setStep('test');
    toast.info('🤔 Now let\'s test if you remember it!');
  };

  const handleTestSelect = (icon) => {
    if (testPhrase.length >= 12) return;
    
    const newTest = [...testPhrase, icon];
    setTestPhrase(newTest);
  };

  const handleTestRemove = (index) => {
    setTestPhrase(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerifyPhrase = () => {
    const isCorrect = testPhrase.every((icon, i) => icon.id === seedPhrase[i].id);

    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      toast.success(`🎉 Perfect! +${level.xp} XP | Badge: ${level.badge}`);
      setTimeout(() => {
        onComplete({ id: level.id, xp: level.xp, badge: level.badge });
      }, 2000);
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        toast.error('😬 Oh no! Let me show you a hint...');
        // Show first 3 icons as hint
        setTimeout(() => {
          setTestPhrase(seedPhrase.slice(0, 3));
          toast.info('💡 First 3 icons filled in for you!');
        }, 1000);
      } else {
        toast.error('❌ Not quite right! Try again.');
        setTestPhrase([]);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6 border-2 border-primary/30">
      {/* Create Phase */}
      {step === 'create' && (
        <>
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2">🔐</div>
            <h2 className="text-2xl font-bold text-gradient-neon">Create Your Icon Seed Phrase</h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
              Choose 12 fun icons to be your secret wallet key!
            </p>
            <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-lg px-4 py-2 border-2 border-secondary/30">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-semibold text-sm">
                Selected: {selectedIcons.length}/12
              </span>
            </div>
          </div>

          {/* Selected Icons Display */}
          <Card className="p-6 min-h-[180px] bg-card/50 border-2 border-primary/20">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {selectedIcons.map((icon, index) => (
                <motion.button
                  key={`selected-${index}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  onClick={() => handleRemoveIcon(index)}
                  className="relative aspect-square bg-gradient-to-br from-primary to-primary/80 rounded-lg flex flex-col items-center justify-center p-2 hover:from-primary/90 hover:to-primary/70 transition-all"
                  style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.4)' }}
                >
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-secondary text-background text-xs font-bold flex items-center justify-center border-2 border-background">
                    {index + 1}
                  </div>
                  <div className="text-3xl">{icon.emoji}</div>
                  <div className="text-[10px] text-primary-foreground font-semibold mt-1">{icon.name}</div>
                </motion.button>
              ))}
              {Array(12 - selectedIcons.length).fill(null).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
                >
                  <Lock className="w-6 h-6 text-muted-foreground opacity-30" />
                </div>
              ))}
            </div>
          </Card>

          {/* Available Icons */}
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Choose from these icons:</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {SEED_ICONS.map((icon, index) => (
                <motion.button
                  key={icon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIconSelect(icon)}
                  className="aspect-square bg-card border-2 border-border rounded-lg flex flex-col items-center justify-center p-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="text-2xl">{icon.emoji}</div>
                  <div className="text-[8px] text-center" style={{ color: 'hsl(0 0% 75%)' }}>{icon.name}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Review Phase */}
      {step === 'review' && (
        <>
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2">📝</div>
            <h2 className="text-2xl font-bold text-gradient-neon">Review Your Seed Phrase</h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
              Memorize these icons in order! You'll need them to recover your wallet.
            </p>
          </div>

          <Card className="p-6 bg-secondary/5 border-2 border-secondary/30">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {selectedIcons.map((icon, index) => (
                <motion.div
                  key={`review-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-square bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex flex-col items-center justify-center p-2"
                  style={{ boxShadow: '0 0 15px hsl(var(--secondary) / 0.3)' }}
                >
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-background text-xs font-bold flex items-center justify-center border-2 border-background">
                    {index + 1}
                  </div>
                  <div className="text-3xl">{icon.emoji}</div>
                  <div className="text-[10px] text-secondary-foreground font-semibold mt-1">{icon.name}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-accent/10 border-2 border-accent/30">
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>
              ⚠️ <strong className="text-accent">Important:</strong> In real Web3, NEVER share your seed phrase with anyone!
              It's like your master password. Keep it super secret! 🤫
            </p>
          </Card>

          <Button
            onClick={handleConfirmPhrase}
            className="w-full btn-retro text-lg"
            size="lg"
            style={{
              background: 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))',
              border: '2px solid hsl(180 100% 50% / 0.5)'
            }}
          >
            I've Memorized It! Test Me 🧠
          </Button>
        </>
      )}

      {/* Test Phase */}
      {step === 'test' && (
        <>
          <div className="text-center space-y-3">
            <div className="text-5xl mb-2">🧪</div>
            <h2 className="text-2xl font-bold text-gradient-neon">Recovery Test!</h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
              Oh no! Gary the Goat forgot his wallet phrase! Help him recover it by selecting the icons in the correct order.
            </p>
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-lg px-4 py-2 border-2 border-accent/30">
              <span className="text-accent font-semibold text-sm">
                Progress: {testPhrase.length}/12
              </span>
            </div>
          </div>

          {/* Test Answer Area */}
          <Card className="p-6 min-h-[180px] bg-card/50 border-2 border-primary/20">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {testPhrase.map((icon, index) => (
                <motion.button
                  key={`test-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => handleTestRemove(index)}
                  className="relative aspect-square bg-gradient-to-br from-primary to-primary/80 rounded-lg flex flex-col items-center justify-center p-2"
                >
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-secondary text-background text-xs font-bold flex items-center justify-center border-2 border-background">
                    {index + 1}
                  </div>
                  <div className="text-3xl">{icon.emoji}</div>
                  <div className="text-[10px] text-primary-foreground font-semibold mt-1">{icon.name}</div>
                </motion.button>
              ))}
              {Array(12 - testPhrase.length).fill(null).map((_, index) => (
                <div
                  key={`empty-test-${index}`}
                  className="aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">#{testPhrase.length + index + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Icon Selection for Test */}
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Select icons in order:</p>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {SEED_ICONS.map((icon) => (
                <motion.button
                  key={icon.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTestSelect(icon)}
                  className="aspect-square bg-card border-2 border-border rounded-lg flex flex-col items-center justify-center p-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="text-2xl">{icon.emoji}</div>
                  <div className="text-[8px] text-center" style={{ color: 'hsl(0 0% 75%)' }}>{icon.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setTestPhrase([])}
              className="flex-1 border-2"
            >
              Clear
            </Button>
            <Button
              onClick={handleVerifyPhrase}
              disabled={testPhrase.length !== 12}
              className="flex-1 btn-retro"
              style={{
                background: testPhrase.length === 12 ? 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))' : undefined,
                border: '2px solid hsl(180 100% 50% / 0.5)'
              }}
            >
              Verify Phrase
            </Button>
          </div>

          {attempts > 0 && (
            <p className="text-xs text-center text-accent">
              💡 Attempts: {attempts}/3 - Need help? Try 3 times for a hint!
            </p>
          )}
        </>
      )}
    </Card>
  );
}