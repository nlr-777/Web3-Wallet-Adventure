import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Shield, Wallet } from 'lucide-react';

export default function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--gradient-hero)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12 text-center space-y-6 shadow-2xl border-4 border-primary/20">
          {/* Title with animated icons */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="space-y-4"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Wallet className="w-12 h-12 text-primary" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-secondary" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Shield className="w-12 h-12 text-accent" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-adventure leading-tight">
              Web3 Wallet Adventure
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-foreground/80">
              Keep Your Treasures Safe! 🏴‍☠️
            </p>
          </motion.div>

          {/* Sam's Introduction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/50 rounded-2xl p-6 space-y-3 border-2 border-primary/20"
          >
            <div className="flex items-center gap-3 justify-center">
              <div className="text-4xl animate-bounce">🧑‍🚀</div>
              <div className="text-left">
                <p className="font-bold text-lg text-primary">Sam the Skeptic says:</p>
                <p className="text-foreground/70 text-sm">Your guide to Web3 safety!</p>
              </div>
            </div>
            <blockquote className="text-lg font-medium text-foreground italic border-l-4 border-primary pl-4">
              "Wallets are like magic backpacks — only you have the key! Let me show you how to keep them safe on this adventure!"
            </blockquote>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"
          >
            <div className="bg-primary/10 rounded-xl p-4 space-y-2">
              <div className="text-3xl">🗺️</div>
              <p className="font-semibold text-foreground">5 Fun Levels</p>
              <p className="text-muted-foreground text-xs">Adventure map to explore</p>
            </div>
            <div className="bg-secondary/10 rounded-xl p-4 space-y-2">
              <div className="text-3xl">🏆</div>
              <p className="font-semibold text-foreground">Earn Badges</p>
              <p className="text-muted-foreground text-xs">Collect XP & rewards</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-4 space-y-2">
              <div className="text-3xl">🛡️</div>
              <p className="font-semibold text-foreground">Learn Safety</p>
              <p className="text-muted-foreground text-xs">Web3 security tips</p>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="w-full text-xl py-6 font-bold btn-adventure shadow-lg"
              style={{ background: 'var(--gradient-button)' }}
            >
              🚀 Start Adventure!
            </Button>
          </motion.div>

          {/* BlockQuest Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <a
              href="https://blockquestofficial.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <span>🏠</span>
              <span className="underline">Back to BlockQuest HQ</span>
            </a>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}