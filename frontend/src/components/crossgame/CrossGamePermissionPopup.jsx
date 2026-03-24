import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, Zap, Wallet, Info } from 'lucide-react';
import { formatBQTokens } from '../../lib/wallet';
import { GAMES } from '../../lib/useCrossGameWallet';

export default function CrossGamePermissionPopup({ permissions, onApprove, onDeny, currentBalance }) {
  if (!permissions || permissions.length === 0) return null;

  const permission = permissions[0]; // Show first pending permission
  const transaction = permission.transaction;
  const hasEnoughBalance = currentBalance >= transaction.gasCost;

  const getGameName = (gameId) => {
    switch(gameId) {
      case GAMES.STUDIO: return 'BlockQuest Studio';
      case GAMES.WALLET_ADVENTURE: return 'Wallet Adventure';
      case GAMES.MAIN_HUB: return 'BlockQuest HQ';
      default: return gameId;
    }
  };

  const getTransactionTitle = () => {
    switch(transaction.type) {
      case 'nft_mint': return 'Mint NFT';
      case 'send': return 'Send Tokens';
      case 'vault': return 'Vault Storage';
      default: return 'Transaction';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg"
        >
          <Card className="p-6 space-y-6 border-4 border-accent/50 relative overflow-hidden">
            {/* Alert decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-secondary to-primary"></div>

            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto border-4 border-accent/50">
                  <AlertTriangle className="w-10 h-10 text-accent" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Cross-Game Permission Required
              </h2>
              <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
                {getGameName(transaction.fromGame)} is requesting access to your wallet
              </p>
            </div>

            {/* Transaction Details */}
            <Card className="p-4 bg-card/50 space-y-3 border-2 border-primary/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Action:</span>
                <Badge className="bg-accent">{getTransactionTitle()}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>From Game:</span>
                <span className="text-sm font-bold text-foreground">{getGameName(transaction.fromGame)}</span>
              </div>

              {transaction.nftData && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'hsl(0 0% 75%)' }}>NFT Details:</p>
                  <div className="bg-primary/5 rounded-lg p-3 space-y-1">
                    <p className="text-sm font-bold text-primary">{transaction.nftData.name}</p>
                    {transaction.nftData.description && (
                      <p className="text-xs" style={{ color: 'hsl(0 0% 75%)' }}>{transaction.nftData.description}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Gas Fee:</span>
                  </div>
                  <span className="text-xl font-black text-accent">{formatBQTokens(transaction.gasCost)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>Your Balance:</span>
                  </div>
                  <span className={`text-lg font-bold ${
                    hasEnoughBalance ? 'text-success' : 'text-destructive'
                  }`}>
                    {formatBQTokens(currentBalance)}
                  </span>
                </div>

                {hasEnoughBalance && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold" style={{ color: 'hsl(0 0% 75%)' }}>After Transaction:</span>
                    <span className="text-sm font-bold text-foreground">
                      {formatBQTokens(currentBalance - transaction.gasCost)}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Warning for insufficient balance */}
            {!hasEnoughBalance && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 bg-destructive/10 border-2 border-destructive/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-destructive text-sm mb-1">Insufficient Balance</p>
                      <p className="text-xs" style={{ color: 'hsl(0 0% 85%)' }}>
                        You need {formatBQTokens(transaction.gasCost - currentBalance)} more BQ tokens to complete this transaction.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Info */}
            <Card className="p-3 bg-primary/5 border border-primary/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: 'hsl(0 0% 85%)' }}>
                  This is a cross-game transaction. Your BQ balance is shared across all BlockQuest games.
                  Approving will deduct the gas fee from your total balance.
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onDeny(permission.id)}
                variant="outline"
                className="flex-1 border-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                size="lg"
              >
                Deny
              </Button>
              <Button
                onClick={() => onApprove(permission.id)}
                disabled={!hasEnoughBalance}
                className="flex-1 btn-retro"
                size="lg"
                style={{
                  background: hasEnoughBalance 
                    ? 'linear-gradient(135deg, hsl(150 100% 50%), hsl(180 100% 50%))'
                    : 'hsl(0 0% 40%)',
                  border: '2px solid hsl(180 100% 50% / 0.5)'
                }}
              >
                {hasEnoughBalance ? '✓ Approve' : 'Not Enough BQ'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}