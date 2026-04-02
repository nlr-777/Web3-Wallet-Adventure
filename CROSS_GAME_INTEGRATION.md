# Cross-Game Wallet Integration - Documentation

## Overview
The Cross-Game Wallet system enables shared BQ token balance, NFT minting, and XP tracking across all BlockQuest games.

## Architecture

### Frontend Components

#### 1. `useCrossGameWallet` Hook (`/lib/useCrossGameWallet.js`)
Main hook for cross-game wallet functionality.

**Features:**
- Shared BQ balance across all games
- NFT minting with cross-game gas fees
- Permission system for cross-game transactions
- XP tracking per game
- LocalStorage + Backend sync

**Usage:**
```javascript
import useCrossGameWallet, { GAMES } from './lib/useCrossGameWallet';

const {
  crossGameWallet,
  pendingPermissions,
  initializePlayer,
  getBalance,
  mintNFT,
  claimXP,
  approvePermission,
  denyPermission
} = useCrossGameWallet(GAMES.WALLET_ADVENTURE);
```

#### 2. `CrossGamePermissionPopup` Component
Modal that appears when another game requests to deduct BQ tokens.

**Props:**
- `permissions` - Array of pending permission requests
- `onApprove` - Handler for approval
- `onDeny` - Handler for denial
- `currentBalance` - Current BQ balance

**Features:**
- Shows transaction details
- Displays gas cost and remaining balance
- Checks for sufficient funds
- Visual warnings for insufficient balance

#### 3. `UnifiedXPClaim` Component
Universal XP claim screen used by all BlockQuest games.

**Props:**
- `xpData` - Object with { game, xp, reason, badge, additionalRewards }
- `onClaim` - Handler when rewards are claimed

**Features:**
- Game-specific branding
- Animated XP display
- Badge showcase
- Additional rewards list
- Confetti celebration

#### 4. `NFTHistory` Component
Displays all NFTs minted across games.

**Props:**
- `nfts` - Array of NFT objects

**Features:**
- Grid layout with NFT cards
- Shows mint source game
- Displays attributes
- Hover effects

### Backend API Endpoints

#### POST `/api/cross-game/sync`
Sync cross-game wallet data to backend.

**Request:**
```json
{
  "playerName": "string",
  "totalBQ": 1000,
  "games": {
    "wallet_adventure": { "xp": 0, "level": 1 },
    "blockquest_studio": { "xp": 0, "nftsMinted": 0 }
  },
  "nfts": [],
  "transactions": []
}
```

#### GET `/api/cross-game/wallet/{player_name}`
Fetch wallet for a player.

#### POST `/api/cross-game/nft/mint`
Record NFT mint from another game.

**Request:**
```json
{
  "playerName": "string",
  "nftData": {
    "name": "My NFT",
    "description": "Description",
    "emoji": "🎨"
  },
  "gasCost": 50,
  "fromGame": "blockquest_studio"
}
```

#### POST `/api/cross-game/xp/claim`
Claim XP to a specific game.

**Request:**
```json
{
  "playerName": "string",
  "game": "wallet_adventure",
  "xpAmount": 100
}
```

#### GET `/api/cross-game/leaderboard?game={game_id}`
Get leaderboard across games.

## Game Integration Guide

### For Wallet Adventure
Already integrated! The game:
- Initializes cross-game wallet on start
- Claims XP on level completion
- Shows unified XP claim screen
- Handles permission requests from other games

### For BlockQuest Studio (or other games)

**Step 1: Initialize the hook**
```javascript
import useCrossGameWallet, { GAMES } from './lib/useCrossGameWallet';

function MyGame() {
  const {
    crossGameWallet,
    initializePlayer,
    mintNFT,
    claimXP
  } = useCrossGameWallet(GAMES.STUDIO);
  
  // Initialize on mount
  useEffect(() => {
    const playerName = localStorage.getItem('player_name');
    if (playerName) {
      initializePlayer(playerName);
    }
  }, []);
}
```

**Step 2: Mint NFT (triggers permission popup)**
```javascript
const handleMintNFT = async () => {
  try {
    const nft = await mintNFT(
      {
        name: 'My Artwork',
        description: 'Beautiful art',
        emoji: '🎨',
        attributes: [
          { trait_type: 'Rarity', value: 'Epic' }
        ]
      },
      50 // gas cost in BQ
    );
    
    // NFT minted successfully
    console.log('Minted:', nft);
  } catch (error) {
    // User denied or insufficient balance
    console.error(error);
  }
};
```

**Step 3: Claim XP**
```javascript
const handleLevelComplete = () => {
  claimXP(GAMES.STUDIO, 100);
  
  // Show unified XP claim screen
  setXpClaimData({
    game: GAMES.STUDIO,
    xp: 100,
    reason: 'Completed Level 1',
    badge: 'Artist Badge'
  });
};
```

**Step 4: Show permission popup**
```javascript
import CrossGamePermissionPopup from './components/crossgame/CrossGamePermissionPopup';

function MyGame() {
  const { pendingPermissions, approvePermission, denyPermission, getBalance } = useCrossGameWallet(GAMES.STUDIO);
  
  return (
    <>
      {/* Your game UI */}
      
      {pendingPermissions.length > 0 && (
        <CrossGamePermissionPopup
          permissions={pendingPermissions}
          onApprove={approvePermission}
          onDeny={denyPermission}
          currentBalance={getBalance()}
        />
      )}
    </>
  );
}
```

## Data Flow

### NFT Minting Flow
1. User clicks "Mint NFT" in BlockQuest Studio
2. Studio calls `mintNFT()` with gas cost
3. Hook creates permission request
4. Permission popup appears in Wallet Adventure context
5. User approves/denies
6. If approved:
   - Gas deducted from shared BQ balance
   - NFT added to wallet
   - Transaction recorded
   - Backend synced
7. Studio receives success/error

### XP Claiming Flow
1. User completes level in any game
2. Game calls `claimXP(gameId, xpAmount)`
3. XP added to game-specific counter
4. `UnifiedXPClaim` component shown
5. User clicks "Claim Rewards"
6. Confetti celebration
7. Backend synced

## Storage Structure

### LocalStorage Key: `blockquest_cross_game_wallet`
```json
{
  "playerName": "string",
  "totalBQ": 1000,
  "games": {
    "wallet_adventure": {
      "xp": 0,
      "level": 1,
      "lastPlayed": 1234567890
    },
    "blockquest_studio": {
      "xp": 0,
      "nftsMinted": 0,
      "lastPlayed": null
    }
  },
  "nfts": [
    {
      "id": "nft_1234567890",
      "name": "My NFT",
      "description": "...",
      "emoji": "🎨",
      "mintedAt": 1234567890,
      "mintedFrom": "blockquest_studio",
      "attributes": []
    }
  ],
  "transactions": [
    {
      "id": "tx_1234567890",
      "amount": -50,
      "reason": "gas_fee_nft_mint_from_blockquest_studio",
      "game": "blockquest_studio",
      "timestamp": 1234567890,
      "newBalance": 950
    }
  ],
  "createdAt": 1234567890,
  "lastSynced": 1234567890
}
```

## Testing

Use the `CrossGameDemo` component to test:
```
http://localhost:3000 (add demo route in App.js)
```

Features to test:
1. Initialize wallet with player name
2. View shared BQ balance
3. Mint NFT (triggers permission)
4. Approve/deny permissions
5. View NFT history
6. Claim XP to different games
7. Check balance deduction
8. Verify backend sync

## Future Enhancements

1. **Real-time sync** - WebSocket for instant updates
2. **NFT marketplace** - Trade NFTs between players
3. **Achievement system** - Cross-game achievements
4. **Battle pass** - Progress shared across games
5. **Leaderboards** - Compete across all games
6. **Social features** - Friend requests, gifts
7. **Token staking** - Earn rewards for holding BQ
8. **Cross-game quests** - Complete tasks across multiple games
