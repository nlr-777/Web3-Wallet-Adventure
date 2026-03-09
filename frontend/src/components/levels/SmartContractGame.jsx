import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CONTRACT_STEPS = [
  {
    id: 1,
    condition: 'IF',
    action: 'I send 10 treasure coins',
    completed: false
  },
  {
    id: 2,
    condition: 'THEN',
    action: 'You send me the magic sword',
    completed: false
  },
  {
    id: 3,
    condition: 'AND',
    action: 'The trade happens automatically',
    completed: false
  }
];

export default function SmartContractGame({ level, onComplete }) {
  const [steps, setSteps] = useState(CONTRACT_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [contractSigned, setContractSigned] = useState(false);

  const handleStepComplete = (stepId) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    );
    setSteps(updatedSteps);
    setCurrentStep(currentStep + 1);
    toast.success(`Step ${stepId} completed!`);
  };

  const handleSignContract = () => {
    setContractSigned(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    toast.success(`🎉 Smart Contract Signed! +${level.xp} XP | Badge: ${level.badge}`);
    setTimeout(() => {
      onComplete({ id: level.id, xp: level.xp, badge: level.badge });
    }, 2000);
  };

  const allStepsCompleted = steps.every(step => step.completed);

  return (
    <Card className="p-6 space-y-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Create a Smart Contract Promise</h2>
        <p className="text-muted-foreground text-sm">Click each step to complete the if-then logic puzzle!</p>
      </div>

      {/* Trade Scenario */}
      <Card className="p-4 bg-primary/5 border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🧝</div>
          <div>
            <p className="font-bold text-foreground">The Wizard's Trade</p>
            <p className="text-sm text-muted-foreground">The wizard wants to trade a magic sword for 10 treasure coins. Let's create a smart contract to make sure the trade is fair!</p>
          </div>
        </div>
      </Card>

      {/* Contract Steps */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-muted-foreground">Build the Smart Contract:</p>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 transition-all ${
                step.completed
                  ? 'bg-success/10 border-2 border-success'
                  : currentStep === index
                  ? 'border-2 border-primary cursor-pointer hover:bg-primary/5'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => !step.completed && currentStep === index && handleStepComplete(step.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    step.completed ? 'bg-success text-success-foreground' : 'bg-primary/20 text-primary'
                  }`}>
                    {step.completed ? <CheckCircle className="w-6 h-6" /> : step.id}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-accent mb-1">{step.condition}</p>
                    <p className="text-foreground">{step.action}</p>
                  </div>
                </div>
                {!step.completed && currentStep === index && (
                  <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visual Trade Representation */}
      {allStepsCompleted && !contractSigned && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="p-6 bg-secondary/10 border-2 border-secondary/30">
            <div className="flex items-center justify-between gap-4">
              <div className="text-center flex-1">
                <div className="text-5xl mb-2">👤</div>
                <p className="font-semibold text-foreground">You</p>
                <div className="mt-2 bg-card rounded-lg p-3 border-2 border-secondary">
                  <p className="text-2xl font-bold text-secondary">10 💰</p>
                  <p className="text-xs text-muted-foreground">Treasure Coins</p>
                </div>
              </div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-4xl"
              >
                ⇄
              </motion.div>

              <div className="text-center flex-1">
                <div className="text-5xl mb-2">🧝</div>
                <p className="font-semibold text-foreground">Wizard</p>
                <div className="mt-2 bg-card rounded-lg p-3 border-2 border-primary">
                  <p className="text-2xl font-bold text-primary">⚔️</p>
                  <p className="text-xs text-muted-foreground">Magic Sword</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-accent/10 border-2 border-accent/30">
            <div className="text-center space-y-2">
              <p className="font-bold text-accent">🤖 Smart Contract Ready!</p>
              <p className="text-sm text-foreground/80">
                The contract will automatically execute the trade when both parties agree. No one can cheat!
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Button */}
      {!allStepsCompleted ? (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click the steps in order to build your smart contract
          </p>
        </div>
      ) : !contractSigned ? (
        <Button
          onClick={handleSignContract}
          className="w-full btn-adventure text-lg"
          size="lg"
          style={{ background: 'var(--gradient-button)' }}
        >
          ✍️ Sign Smart Contract
        </Button>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-success/20 rounded-xl p-4 text-center border-2 border-success"
        >
          <p className="text-success font-bold text-lg">✅ Contract Executed Successfully!</p>
          <p className="text-sm text-muted-foreground mt-1">The trade happened automatically - that's the magic of smart contracts!</p>
        </motion.div>
      )}
    </Card>
  );
}