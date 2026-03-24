import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Image, ExternalLink, Sparkles } from 'lucide-react';
import { GAMES } from '../../lib/useCrossGameWallet';

export default function NFTHistory({ nfts }) {
  const getGameName = (gameId) => {
    switch(gameId) {
      case GAMES.STUDIO: return 'BlockQuest Studio';
      case GAMES.WALLET_ADVENTURE: return 'Wallet Adventure';
      case GAMES.MAIN_HUB: return 'BlockQuest HQ';
      default: return gameId;
    }
  };

  if (!nfts || nfts.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-border">
        <div className="text-6xl mb-4 opacity-30">🖼️</div>
        <p className="text-lg font-bold text-foreground mb-2">No NFTs Yet</p>
        <p className="text-sm" style={{ color: 'hsl(0 0% 65%)' }}>
          Mint your first NFT in BlockQuest Studio!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gradient-neon" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Your NFT Collection 🖼️
        </h3>
        <Badge className="bg-primary">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nfts.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:bg-card/80 transition-all border-2 border-border hover:border-primary/50 cursor-pointer group">
              {/* NFT Image/Icon */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">{nft.emoji || '🎨'}</div>
                )}
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
              </div>

              {/* NFT Info */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-foreground truncate">{nft.name}</h4>
                  {nft.description && (
                    <p className="text-xs line-clamp-2" style={{ color: 'hsl(0 0% 75%)' }}>
                      {nft.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span style={{ color: 'hsl(0 0% 65%)' }}>Minted from:</span>
                    <p className="font-semibold text-primary text-xs">{getGameName(nft.mintedFrom)}</p>
                  </div>
                  <div className="text-right">
                    <span style={{ color: 'hsl(0 0% 65%)' }}>Date:</span>
                    <p className="font-semibold text-foreground text-xs">
                      {new Date(nft.mintedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {nft.attributes && nft.attributes.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                    {nft.attributes.slice(0, 3).map((attr, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] px-2 py-0">
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* View Details (hover state) */}
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}