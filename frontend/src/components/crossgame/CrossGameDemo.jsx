import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Wallet, Zap, Image as ImageIcon } from 'lucide-react';
import useCrossGameWallet, { GAMES } from '../../lib/useCrossGameWallet';
import { formatBQTokens } from '../../lib/wallet';
import { toast } from 'sonner';
import NFTHistory from './NFTHistory';

// Demo component to test cross-game features
export default function CrossGameDemo() {
  const [playerName, setPlayerName] = useState('');
  const [nftName, setNftName] = useState('');
  const [gasCost, setGasCost] = useState(50);
  
  const {
    crossGameWallet,
    initializePlayer,
    getBalance,
    mintNFT,
    claimXP
  } = useCrossGameWallet(GAMES.STUDIO);

  const handleInitialize = () => {
    if (!playerName) {
      toast.error('Please enter a player name');
      return;
    }
    initializePlayer(playerName);
    toast.success(`Wallet initialized for ${playerName}`);
  };

  const handleMintNFT = async () => {
    if (!nftName) {
      toast.error('Please enter NFT name');
      return;
    }

    if (!crossGameWallet) {
      toast.error('Please initialize wallet first');
      return;
    }

    try {
      const nft = await mintNFT(
        {
          name: nftName,
          description: 'A beautiful BlockQuest NFT',
          emoji: '🎨',
          attributes: [
            { trait_type: 'Rarity', value: 'Epic' },
            { trait_type: 'Collection', value: 'BlockQuest Studio' }
          ]
        },
        gasCost
      );

      toast.success(`NFT "${nftName}" minted successfully!`);
      setNftName('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClaimXP = () => {
    if (!crossGameWallet) {
      toast.error('Please initialize wallet first');
      return;
    }

    claimXP(GAMES.STUDIO, 100);
    toast.success('+100 XP claimed to BlockQuest Studio!');
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, hsl(220 25% 10%) 0%, hsl(220 25% 15%) 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Cross-Game Wallet Demo
          </h1>
          <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>
            Test NFT minting and cross-game transactions
          </p>
        </div>

        {/* Wallet Status */}
        {crossGameWallet ? (
          <Card className="p-6 border-2 border-primary/30" style={{ background: 'linear-gradient(135deg, hsl(180 100% 50% / 0.1), hsl(270 100% 60% / 0.1))' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>Player: {crossGameWallet.playerName}</p>
                  <p className="text-3xl font-black text-gradient-neon">{formatBQTokens(getBalance())}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>NFTs Minted</p>
                <p className="text-2xl font-bold text-secondary">{crossGameWallet.nfts.length}</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 space-y-4 border-2 border-primary/30">
            <h3 className="font-bold text-lg text-foreground">Initialize Wallet</h3>
            <Input
              placeholder="Enter player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Button
              onClick={handleInitialize}
              className="w-full btn-retro"
              style={{
                background: 'linear-gradient(135deg, hsl(15 100% 60%), hsl(325 100% 50%))',
                border: '2px solid hsl(180 100% 50% / 0.5)'
              }}
            >
              Initialize Cross-Game Wallet
            </Button>
          </Card>
        )}

        {/* Mint NFT Section */}
        {crossGameWallet && (
          <Card className="p-6 space-y-4 border-2 border-secondary/30">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-lg text-foreground">Mint NFT (BlockQuest Studio)</h3>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="NFT name..."
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: 'hsl(0 0% 75%)' }}>Gas Cost:</span>
                <Input
                  type="number"
                  value={gasCost}
                  onChange={(e) => setGasCost(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm font-bold text-accent">BQ</span>
              </div>
              <Button
                onClick={handleMintNFT}
                className="w-full btn-retro"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 100% 60%), hsl(325 100% 50%))',
                  border: '2px solid hsl(180 100% 50% / 0.5)'
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Mint NFT (Deducts {gasCost} BQ from Wallet Adventure)
              </Button>
              <p className="text-xs text-center" style={{ color: 'hsl(0 0% 65%)' }}>
                ⚠️ This will trigger a permission popup from Wallet Adventure
              </p>
            </div>
          </Card>
        )}

        {/* Claim XP Section */}
        {crossGameWallet && (
          <Card className="p-6 space-y-4 border-2 border-accent/30">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-lg text-foreground">Claim XP</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(crossGameWallet.games).map(([gameId, gameData]) => (
                <Card key={gameId} className="p-3 text-center bg-primary/5">
                  <p className="text-xs mb-1" style={{ color: 'hsl(0 0% 75%)' }}>
                    {gameId.split('_')[1]}
                  </p>
                  <p className="text-xl font-bold text-primary">{gameData.xp} XP</p>
                </Card>
              ))}
            </div>
            <Button
              onClick={handleClaimXP}
              variant="outline"
              className="w-full border-2 border-accent"
            >
              +100 XP to Studio
            </Button>
          </Card>
        )}

        {/* NFT History */}
        {crossGameWallet && crossGameWallet.nfts.length > 0 && (
          <NFTHistory nfts={crossGameWallet.nfts} />
        )}

        {/* Instructions */}
        <Card className="p-6 bg-accent/10 border-2 border-accent/30">
          <h3 className="font-bold text-accent mb-3">How it Works:</h3>
          <ol className="space-y-2 text-sm" style={{ color: 'hsl(0 0% 85%)' }}>
            <li>1️⃣ Initialize your cross-game wallet with a player name</li>
            <li>2️⃣ Your BQ balance is shared across all BlockQuest games</li>
            <li>3️⃣ Mint an NFT in Studio - it requests permission to deduct gas from Wallet Adventure</li>
            <li>4️⃣ Approve the permission popup to complete the transaction</li>
            <li>5️⃣ NFT appears in your wallet history across all games</li>
            <li>6️⃣ XP earned in any game is tracked separately per game</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}