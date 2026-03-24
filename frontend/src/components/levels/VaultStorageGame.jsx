import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Vault, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { loadWallet, saveWallet, createTransaction, formatBQTokens, GAS_LEVELS } from '../../lib/wallet';
import GasFeeSelector from '../wallet/GasFeeSelector';
import GasFeeMiniGame from '../wallet/GasFeeMiniGame';
import TransactionSimulator from '../wallet/TransactionSimulator';
import WalletBalance from '../wallet/WalletBalance';

export default function VaultStorageGame({ level, onComplete }) {
  const [wallet, setWallet] = useState(loadWallet());
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('input'); // input, gas-select, mini-game, transaction
  const [selectedGas, setSelectedGas] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [bonusBQ, setBonusBQ] = useState(0);

  const handleStartVault = () => {
    const vaultAmount = parseInt(amount);
    
    if (!vaultAmount || vaultAmount <= 0) {
      toast.error('Please enter a valid amount!');
      return;
    }

    if (vaultAmount > wallet.balance) {
      toast.error('Not enough BQ tokens!');
      return;
    }

    setStep('gas-select');
  };

  const handleGasSelected = (gas) => {
    setSelectedGas(gas);
    setStep('mini-game');
  };

  const handleMiniGameComplete = (perfect, bonus) => {
    setBonusBQ(bonus);
    
    const vaultAmount = parseInt(amount);
    const totalCost = vaultAmount + selectedGas.cost;

    if (totalCost > wallet.balance) {
      toast.error('Not enough BQ tokens for transaction + gas!');
      setStep('input');
      return;
    }

    // Create transaction
    const tx = createTransaction('vault', vaultAmount, 'Secure Vault', selectedGas);
    setCurrentTransaction(tx);

    // Update wallet
    const newWallet = {
      ...wallet,
      balance: wallet.balance - totalCost + bonus,
      totalGasSpent: wallet.totalGasSpent + selectedGas.cost,
      transactions: [...wallet.transactions, tx]
    };
    setWallet(newWallet);
    saveWallet(newWallet);

    setStep('transaction');
  };

  const handleTransactionComplete = () => {
    // Mark transaction as confirmed
    const updatedTx = { ...currentTransaction, status: 'confirmed' };
    const updatedWallet = {
      ...wallet,
      transactions: wallet.transactions.map(tx => 
        tx.id === currentTransaction.id ? updatedTx : tx
      )
    };
    saveWallet(updatedWallet);

    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    toast.success(`🎉 Vault Complete! +${level.xp} XP | Badge: ${level.badge}`);
    
    setTimeout(() => {
      onComplete({ 
        id: level.id, 
        xp: level.xp + bonusBQ, 
        badge: level.badge 
      });
    }, 2000);
  };

  return (
    <>
      <Card className="p-6 space-y-6 border-2 border-primary/30">
        {/* Wallet Balance */}
        <WalletBalance balance={wallet.balance} totalGasSpent={wallet.totalGasSpent} />

        {/* Input Phase */}
        {step === 'input' && (
          <>
            <div className="text-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <Vault className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gradient-neon">Store in Secure Vault</h2>
              <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
                How many BQ tokens do you want to lock up safely?
              </p>
            </div>

            <Card className="p-6 bg-secondary/5 border-2 border-secondary/30 space-y-4">
              <div className="flex items-center gap-3 justify-center">
                <Coins className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>Available Balance</p>
                  <p className="text-3xl font-black text-secondary">
                    {formatBQTokens(wallet.balance)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>
                  Amount to Vault:
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-center text-2xl font-bold"
                  min="1"
                  max={wallet.balance}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100].map(preset => (
                  <Button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    variant="outline"
                    size="sm"
                    disabled={preset > wallet.balance}
                    className="border-2"
                  >
                    {preset} BQ
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-accent/10 border-2 border-accent/30">
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>
                💡 <strong className="text-accent">Safety Tip:</strong> Vaults are like bank safety deposit boxes!
                Your coins are locked up and super secure. You'll need your keys to access them later.
              </p>
            </Card>

            <Button
              onClick={handleStartVault}
              disabled={!amount || parseInt(amount) <= 0}
              className="w-full btn-retro text-lg"
              size="lg"
              style={{
                background: 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))',
                border: '2px solid hsl(180 100% 50% / 0.5)'
              }}
            >
              🔒 Proceed to Vault
            </Button>
          </>
        )}
      </Card>

      {/* Gas Fee Selector Modal */}
      <AnimatePresence>
        {step === 'gas-select' && (
          <GasFeeSelector
            onSelect={handleGasSelected}
            onCancel={() => setStep('input')}
          />
        )}
      </AnimatePresence>

      {/* Mini-Game Modal */}
      <AnimatePresence>
        {step === 'mini-game' && (
          <GasFeeMiniGame
            onComplete={handleMiniGameComplete}
            onSkip={() => handleMiniGameComplete(false, 0)}
          />
        )}
      </AnimatePresence>

      {/* Transaction Simulator Modal */}
      <AnimatePresence>
        {step === 'transaction' && currentTransaction && (
          <TransactionSimulator
            transaction={currentTransaction}
            onComplete={handleTransactionComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
