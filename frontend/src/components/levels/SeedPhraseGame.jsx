import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { Shuffle } from 'lucide-react';

const CORRECT_PHRASE = [
  'magic', 'wallet', 'treasure', 'adventure', 'quest', 'brave',
  'shield', 'guardian', 'secure', 'victory', 'freedom', 'trust'
];

export default function SeedPhraseGame({ level, onComplete }) {
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    shuffleWords();
  }, []);

  const shuffleWords = () => {
    const shuffled = [...CORRECT_PHRASE].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setSelectedWords([]);
  };

  const getHintText = () => {
    switch(hintLevel) {
      case 0:
        return "💡 The words tell a story about a magical adventure! Think about the journey from start to finish.";
      case 1:
        return "🎯 Start with: 'magic' → 'wallet' → 'treasure'. These are the first 3 words!";
      case 2:
        return "🔥 First 6 words: magic, wallet, treasure, adventure, quest, brave";
      case 3:
        return "⭐ Almost there! First 9: magic, wallet, treasure, adventure, quest, brave, shield, guardian, secure";
      case 4:
        return "🎁 Full answer: magic → wallet → treasure → adventure → quest → brave → shield → guardian → secure → victory → freedom → trust";
      default:
        return "💡 Click for a hint!";
    }
  };

  const showNextHint = () => {
    if (hintLevel < 4) {
      setHintLevel(hintLevel + 1);
      
      // Auto-fill words based on hint level
      if (hintLevel === 1) {
        // Fill first 3 words
        const firstThree = CORRECT_PHRASE.slice(0, 3);
        setSelectedWords(firstThree);
        setWords(words.filter(w => !firstThree.includes(w)));
      } else if (hintLevel === 2) {
        // Fill first 6 words
        const firstSix = CORRECT_PHRASE.slice(0, 6);
        setSelectedWords(firstSix);
        setWords(words.filter(w => !firstSix.includes(w)));
      } else if (hintLevel === 3) {
        // Fill first 9 words
        const firstNine = CORRECT_PHRASE.slice(0, 9);
        setSelectedWords(firstNine);
        setWords(words.filter(w => !firstNine.includes(w)));
      } else if (hintLevel === 4) {
        // Show all words - just let them click unlock
        setSelectedWords(CORRECT_PHRASE);
        setWords([]);
      }
    }
  };

  const handleWordClick = (word, fromSelected = false) => {
    if (fromSelected) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setWords(prev => [...prev, word]);
    } else {
      setWords(prev => prev.filter(w => w !== word));
      setSelectedWords(prev => [...prev, word]);
    }
  };

  const handleCheck = () => {
    if (selectedWords.length !== CORRECT_PHRASE.length) {
      toast.error('Select all 12 words first!');
      return;
    }

    const isCorrect = selectedWords.every((word, index) => word === CORRECT_PHRASE[index]);

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success(`🎉 Wallet Secured! +${level.xp} XP | Badge: ${level.badge}`);
      setTimeout(() => {
        onComplete({ id: level.id, xp: level.xp, badge: level.badge });
      }, 2000);
    } else {
      setAttempts(attempts + 1);
      toast.error('Not quite right! Try the hint button below for help.');
      
      // Auto-show first hint after 2 failed attempts
      if (attempts >= 1 && hintLevel === 0) {
        setTimeout(() => {
          toast.info('💡 Click the "Get Hint" button for help!');
        }, 1000);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6 border-2 border-primary/30 shadow-lg">
      {/* Instructions */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gradient-neon">Arrange the 12 Magic Words</h2>
        <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 space-y-2">
          <p className="text-foreground font-semibold">🎮 How to Play:</p>
          <ol className="text-sm text-muted-foreground text-left space-y-1 max-w-md mx-auto">
            <li>1️⃣ Click words from "Available Words" below</li>
            <li>2️⃣ They'll appear in numbered slots (#1, #2, #3...)</li>
            <li>3️⃣ Click selected words to remove them</li>
            <li>4️⃣ Arrange all 12 words in the correct order</li>
            <li>5️⃣ Hit "Unlock Wallet" when ready!</li>
          </ol>
          <p className="text-xs text-accent font-semibold mt-2">💡 The words tell a story from start to finish!</p>
        </div>
      </div>

      {/* Selected Words Display */}
      <div className="bg-card/50 rounded-xl p-6 min-h-[220px] border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-primary">🔒 Your Seed Phrase ({selectedWords.length}/12):</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setWords([...words, ...selectedWords].sort(() => Math.random() - 0.5));
              setSelectedWords([]);
            }}
            className="border-2 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            Clear All
          </Button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {selectedWords.map((word, index) => (
            <motion.button
              key={`selected-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleWordClick(word, true)}
              className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-3 font-bold hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-glow-cyan cursor-pointer"
              style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.4)' }}
            >
              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-secondary text-background text-[10px] font-bold flex items-center justify-center border-2 border-background">
                {index + 1}
              </div>
              <div className="mt-1">{word}</div>
            </motion.button>
          ))}
          {Array(12 - selectedWords.length).fill(null).map((_, index) => (
            <div key={`empty-${index}`} className="bg-muted/30 rounded-lg p-3 border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground">#{selectedWords.length + index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Words */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground">Available Words:</p>
          <Button
            variant="outline"
            size="sm"
            onClick={shuffleWords}
            className="border-2"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {words.map((word, index) => {
            // Check if this word is the next correct word
            const isNextCorrect = word === CORRECT_PHRASE[selectedWords.length];
            
            return (
              <motion.button
                key={`word-${index}-${word}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordClick(word)}
                className={`relative border-2 rounded-lg p-3 font-semibold transition-all ${
                  isNextCorrect && hintLevel >= 2
                    ? 'border-secondary bg-secondary/20 animate-pulse-glow'
                    : 'border-border bg-card hover:border-primary hover:bg-primary/5'
                }`}
              >
                {isNextCorrect && hintLevel >= 2 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-background text-xs font-bold flex items-center justify-center animate-bounce">
                    ⭐
                  </div>
                )}
                {word}
              </motion.button>
            );
          })}
        </div>
        {hintLevel >= 2 && words.length > 0 && (
          <p className="text-center text-xs text-secondary font-semibold animate-pulse">
            ⭐ Look for the glowing word - that's the next one!
          </p>
        )}
      </div>

      {/* Progressive Hint System */}
      <div className="space-y-3">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={showNextHint}
            disabled={hintLevel >= 4}
            className="border-2 border-secondary/50 hover:border-secondary text-secondary font-bold"
            size="lg"
          >
            {hintLevel >= 4 ? '✅ All Hints Used!' : `💡 Get Hint (${hintLevel}/4)`}
          </Button>
        </div>
        
        {hintLevel > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-4 border-2 space-y-2"
            style={{
              background: 'linear-gradient(135deg, hsl(325 100% 50% / 0.1) 0%, hsl(15 100% 60% / 0.1) 100%)',
              borderColor: 'hsl(var(--secondary) / 0.4)'
            }}
          >
            <p className="text-sm font-bold text-secondary">Hint #{hintLevel}:</p>
            <p className="text-sm text-foreground leading-relaxed">{getHintText()}</p>
            {hintLevel < 4 && (
              <p className="text-xs text-muted-foreground italic">
                💫 Words have been auto-filled for you! Add the remaining ones.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Check Button */}
      <Button
        onClick={handleCheck}
        disabled={selectedWords.length !== 12}
        className="w-full btn-retro text-lg font-bold"
        size="lg"
        style={{ 
          background: 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))',
          border: '2px solid hsl(180 100% 50% / 0.5)'
        }}
      >
        🔓 Unlock Wallet
      </Button>
    </Card>
  );
}