// Cross-Game Wallet Hook - Shared across BlockQuest games
import { useState, useEffect, useCallback } from 'react';
import { loadWallet, saveWallet, createTransaction, generateTxHash } from './wallet';

const CROSS_GAME_STORAGE_KEY = 'blockquest_cross_game_wallet';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Game identifiers
export const GAMES = {
  WALLET_ADVENTURE: 'wallet_adventure',
  STUDIO: 'blockquest_studio',
  MAIN_HUB: 'blockquest_hub'
};

export const useCrossGameWallet = (currentGame = GAMES.WALLET_ADVENTURE) => {
  const [playerName, setPlayerName] = useState(null);
  const [crossGameWallet, setCrossGameWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPermissions, setPendingPermissions] = useState([]);

  // Load cross-game wallet data
  const loadCrossGameWallet = useCallback(() => {
    try {
      const stored = localStorage.getItem(CROSS_GAME_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setCrossGameWallet(data);
        setPlayerName(data.playerName);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to load cross-game wallet:', error);
      return null;
    }
  }, []);

  // Save cross-game wallet data
  const saveCrossGameWallet = useCallback((data) => {
    try {
      localStorage.setItem(CROSS_GAME_STORAGE_KEY, JSON.stringify(data));
      setCrossGameWallet(data);

      // Sync to backend if available
      syncToBackend(data);
    } catch (error) {
      console.error('Failed to save cross-game wallet:', error);
    }
  }, []);

  // Initialize or get player wallet
  const initializePlayer = useCallback((name) => {
    const existing = loadCrossGameWallet();
    
    if (existing && existing.playerName === name) {
      return existing;
    }

    // Create new cross-game wallet
    const newWallet = {
      playerName: name,
      totalBQ: 1000, // Starting balance
      games: {
        [GAMES.WALLET_ADVENTURE]: { xp: 0, level: 1, lastPlayed: Date.now() },
        [GAMES.STUDIO]: { xp: 0, nftsMinted: 0, lastPlayed: null },
        [GAMES.MAIN_HUB]: { xp: 0, achievements: [], lastPlayed: null }
      },
      nfts: [],
      transactions: [],
      createdAt: Date.now(),
      lastSynced: Date.now()
    };

    saveCrossGameWallet(newWallet);
    setPlayerName(name);
    return newWallet;
  }, [loadCrossGameWallet, saveCrossGameWallet]);

  // Get current balance
  const getBalance = useCallback(() => {
    if (!crossGameWallet) return 0;
    return crossGameWallet.totalBQ;
  }, [crossGameWallet]);

  // Update balance
  const updateBalance = useCallback((amount, reason = 'update') => {
    if (!crossGameWallet) return false;

    const newBalance = crossGameWallet.totalBQ + amount;
    if (newBalance < 0) return false; // Insufficient funds

    const updated = {
      ...crossGameWallet,
      totalBQ: newBalance,
      transactions: [
        ...crossGameWallet.transactions,
        {
          id: generateTxHash(),
          amount,
          reason,
          game: currentGame,
          timestamp: Date.now(),
          newBalance
        }
      ],
      lastSynced: Date.now()
    };

    saveCrossGameWallet(updated);
    return true;
  }, [crossGameWallet, currentGame, saveCrossGameWallet]);

  // Request permission for cross-game transaction
  const requestPermission = useCallback((transaction) => {
    return new Promise((resolve, reject) => {
      const permissionRequest = {
        id: Date.now().toString(),
        transaction,
        fromGame: transaction.fromGame,
        timestamp: Date.now(),
        resolve,
        reject
      };

      setPendingPermissions(prev => [...prev, permissionRequest]);
    });
  }, []);

  // Approve permission
  const approvePermission = useCallback((permissionId) => {
    const permission = pendingPermissions.find(p => p.id === permissionId);
    if (!permission) return;

    // Execute transaction
    const success = updateBalance(
      -permission.transaction.gasCost,
      `gas_fee_${permission.transaction.type}_from_${permission.fromGame}`
    );

    if (success) {
      permission.resolve(true);
    } else {
      permission.reject(new Error('Insufficient balance'));
    }

    setPendingPermissions(prev => prev.filter(p => p.id !== permissionId));
  }, [pendingPermissions, updateBalance]);

  // Deny permission
  const denyPermission = useCallback((permissionId) => {
    const permission = pendingPermissions.find(p => p.id === permissionId);
    if (!permission) return;

    permission.reject(new Error('Permission denied by user'));
    setPendingPermissions(prev => prev.filter(p => p.id !== permissionId));
  }, [pendingPermissions]);

  // Mint NFT (cross-game transaction)
  const mintNFT = useCallback(async (nftData, gasCost = 50) => {
    if (!crossGameWallet) {
      throw new Error('No wallet initialized');
    }

    // Request permission from Wallet Adventure
    const transaction = {
      type: 'nft_mint',
      gasCost,
      nftData,
      fromGame: GAMES.STUDIO,
      toGame: GAMES.WALLET_ADVENTURE
    };

    try {
      const approved = await requestPermission(transaction);
      
      if (approved) {
        // Add NFT to wallet
        const nft = {
          id: generateTxHash(),
          ...nftData,
          mintedAt: Date.now(),
          mintedFrom: GAMES.STUDIO
        };

        const updated = {
          ...crossGameWallet,
          nfts: [...crossGameWallet.nfts, nft],
          games: {
            ...crossGameWallet.games,
            [GAMES.STUDIO]: {
              ...crossGameWallet.games[GAMES.STUDIO],
              nftsMinted: (crossGameWallet.games[GAMES.STUDIO].nftsMinted || 0) + 1
            }
          }
        };

        saveCrossGameWallet(updated);
        return nft;
      }
    } catch (error) {
      throw error;
    }
  }, [crossGameWallet, requestPermission, saveCrossGameWallet]);

  // Claim XP from any game
  const claimXP = useCallback((game, xpAmount) => {
    if (!crossGameWallet) return false;

    const updated = {
      ...crossGameWallet,
      games: {
        ...crossGameWallet.games,
        [game]: {
          ...crossGameWallet.games[game],
          xp: (crossGameWallet.games[game].xp || 0) + xpAmount,
          lastPlayed: Date.now()
        }
      },
      lastSynced: Date.now()
    };

    saveCrossGameWallet(updated);
    return true;
  }, [crossGameWallet, saveCrossGameWallet]);

  // Sync to backend
  const syncToBackend = async (walletData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cross-game/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Synced to backend:', data);
      }
    } catch (error) {
      console.warn('Backend sync failed, using local only:', error);
    }
  };

  // Fetch from backend
  const fetchFromBackend = async (playerName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cross-game/wallet/${playerName}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.wallet) {
          saveCrossGameWallet(data.wallet);
          return data.wallet;
        }
      }
    } catch (error) {
      console.warn('Backend fetch failed, using local only:', error);
    }
    return null;
  };

  // Initialize on mount
  useEffect(() => {
    const wallet = loadCrossGameWallet();
    setIsLoading(false);
  }, [loadCrossGameWallet]);

  return {
    playerName,
    crossGameWallet,
    isLoading,
    pendingPermissions,
    initializePlayer,
    getBalance,
    updateBalance,
    mintNFT,
    claimXP,
    approvePermission,
    denyPermission,
    syncToBackend: () => syncToBackend(crossGameWallet),
    fetchFromBackend
  };
};

export default useCrossGameWallet;