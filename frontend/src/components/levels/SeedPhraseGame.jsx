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
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    shuffleWords();
  }, []);

  const shuffleWords = () => {
    const shuffled = [...CORRECT_PHRASE].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setSelectedWords([]);
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
      toast.error('Not quite right! Try again.');
      setSelectedWords([]);
      setWords([...CORRECT_PHRASE].sort(() => Math.random() - 0.5));
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Arrange the 12 Magic Words</h2>
        <p className="text-muted-foreground text-sm">Tap words in the correct order to unlock your wallet!</p>
      </div>

      {/* Selected Words Display */}
      <div className="bg-muted/30 rounded-xl p-6 min-h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-muted-foreground">Your Seed Phrase ({selectedWords.length}/12):</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setWords([...words, ...selectedWords].sort(() => Math.random() - 0.5));
              setSelectedWords([]);
            }}
          >
            Clear
          </Button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {selectedWords.map((word, index) => (
            <motion.button
              key={`selected-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleWordClick(word, true)}
              className="bg-primary text-primary-foreground rounded-lg p-3 font-semibold hover:bg-primary/80 transition-colors"
            >
              <div className="text-xs opacity-70 mb-1">#{index + 1}</div>
              <div>{word}</div>
            </motion.button>
          ))}
          {Array(12 - selectedWords.length).fill(null).map((_, index) => (
            <div key={`empty-${index}`} className="bg-muted/50 rounded-lg p-3 border-2 border-dashed border-border" />
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
          {words.map((word, index) => (
            <motion.button
              key={`word-${index}-${word}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordClick(word)}
              className="bg-card border-2 border-border rounded-lg p-3 font-semibold hover:border-primary hover:bg-primary/5 transition-all"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setShowHint(!showHint)}
          className="text-muted-foreground"
        >
          {showHint ? 'Hide' : 'Show'} Hint 💡
        </Button>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground mt-2 bg-muted/50 rounded-lg p-3"
          >
            The words tell a story about a magical adventure! Think about the journey from start to finish.
          </motion.p>
        )}
      </div>

      {/* Check Button */}
      <Button
        onClick={handleCheck}
        disabled={selectedWords.length !== 12}
        className="w-full btn-adventure"
        size="lg"
        style={{ background: 'var(--gradient-button)' }}
      >
        🔓 Unlock Wallet
      </Button>
    </Card>
  );
}