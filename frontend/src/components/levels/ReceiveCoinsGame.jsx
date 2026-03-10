import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Lightbulb } from 'lucide-react';

const RIDDLE = {
  question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
  answer: "map",
  hints: [
    "Think about something that shows places...",
    "You use it to find your way on adventures!",
    "It starts with M and ends with P"
  ]
};

const FRIEND_ADDRESS = "0xFriend...1234";

export default function ReceiveCoinsGame({ level, onComplete }) {
  const [answer, setAnswer] = useState('');
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [coinsReceived, setCoinsReceived] = useState(false);

  const handleRiddleSubmit = () => {
    if (answer.toLowerCase().trim() === RIDDLE.answer) {
      toast.success('✅ Correct! Your friend is ready to send you coins!');
      setRiddleSolved(true);
    } else {
      toast.error('❌ Wrong answer! Try again or use a hint.');
    }
  };

  const handleReceiveCoins = () => {
    setCoinsReceived(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    toast.success(`🎉 100 coins received! +${level.xp} XP | Badge: ${level.badge}`);
    setTimeout(() => {
      onComplete({ id: level.id, xp: level.xp, badge: level.badge });
    }, 2000);
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Riddle Section */}
      {!riddleSolved ? (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-5xl mb-4 animate-float">🧑‍💻</div>
            <h2 className="text-xl font-bold text-foreground">Your Friend Has a Riddle!</h2>
            <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>Solve it to get your wallet address and receive coins</p>
          </div>

          <Card className="p-6 bg-primary/5 border-2 border-primary/30">
            <p className="text-lg text-foreground font-medium text-center leading-relaxed">
              {RIDDLE.question}
            </p>
          </Card>

          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRiddleSubmit()}
              className="text-center text-lg"
            />
            <Button
              onClick={handleRiddleSubmit}
              className="w-full btn-adventure"
              style={{ background: 'var(--gradient-button)' }}
            >
              Submit Answer
            </Button>
          </div>

          {/* Hint System */}
          <div className="text-center space-y-2">
            {hintIndex < RIDDLE.hints.length - 1 && (
              <Button
                variant="outline"
                onClick={() => setHintIndex(hintIndex + 1)}
                className="border-2"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Hint {hintIndex + 2}/{RIDDLE.hints.length}
              </Button>
            )}
            {hintIndex >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/10 rounded-lg p-3 border-2 border-secondary/30"
              >
                <p className="text-sm font-medium text-foreground">
                  💡 Hint: {RIDDLE.hints[hintIndex]}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* Receive Coins Section */
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center space-y-2"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-foreground">Great Job! Riddle Solved!</h2>
            <p style={{ color: 'hsl(0 0% 75%)' }}>Your friend is ready to send you 100 coins</p>
          </motion.div>

          {/* Wallet Address Display */}
          <Card className="p-6 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Your Wallet Address:</span>
              <span className="text-xs text-primary font-mono">Public & Safe to Share</span>
            </div>
            <div className="bg-card rounded-lg p-4 border-2 border-primary/30">
              <code className="text-primary font-mono text-sm md:text-base break-all">
                0xYourWallet...5678
              </code>
            </div>
            <p className="text-xs text-center" style={{ color: 'hsl(0 0% 75%)' }}>
              ✅ This is like your mailbox address - anyone can send you coins!
            </p>
          </Card>

          {/* Transaction Visualization */}
          <div className="flex items-center justify-center gap-4 py-6">
            <Card className="p-4 text-center">
              <div className="text-3xl mb-2">🧑‍💻</div>
              <p className="text-xs font-semibold">Friend</p>
              <p className="text-xs text-muted-foreground font-mono">{FRIEND_ADDRESS}</p>
            </Card>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-4xl"
            >
              ➡️
            </motion.div>
            
            <Card className="p-4 text-center bg-primary/10 border-2 border-primary/30">
              <div className="text-3xl mb-2">👛</div>
              <p className="text-xs font-semibold text-primary">Your Wallet</p>
              <p className="text-xs text-muted-foreground font-mono">0xYour...5678</p>
            </Card>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-secondary animate-bounce">100 💰</div>
            <p className="text-sm text-muted-foreground">Coins ready to receive!</p>
          </div>

          {!coinsReceived ? (
            <Button
              onClick={handleReceiveCoins}
              className="w-full btn-adventure text-lg"
              size="lg"
              style={{ background: 'var(--gradient-gold)' }}
            >
              💰 Receive Coins
            </Button>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-success/20 rounded-xl p-4 text-center border-2 border-success"
            >
              <p className="text-success font-bold text-lg">✅ Coins Received Successfully!</p>
              <p className="text-sm text-muted-foreground mt-1">Check your dashboard to see your progress</p>
            </motion.div>
          )}
        </div>
      )}
    </Card>
  );
}