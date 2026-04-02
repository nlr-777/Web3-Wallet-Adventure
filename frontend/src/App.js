import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import StartScreen from './components/StartScreen';
import GameMap from './components/GameMap';
import LevelGame from './components/LevelGame';
import ProgressDashboard from './components/ProgressDashboard';
import CompletionScreen from './components/CompletionScreen';
import CrossGamePermissionPopup from './components/crossgame/CrossGamePermissionPopup';
import UnifiedXPClaim from './components/crossgame/UnifiedXPClaim';
import { loadProgress, saveProgress } from './lib/storage';
import useCrossGameWallet, { GAMES } from './lib/useCrossGameWallet';

export default function App() {
  const [gameState, setGameState] = useState('start'); // start, map, level, dashboard, complete, xp-claim
  const [currentLevel, setCurrentLevel] = useState(null);
  const [xpClaimData, setXpClaimData] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0,
    completedLevels: [],
    badges: [],
    currentLevel: 1
  });

  // Cross-game wallet integration
  const {
    crossGameWallet,
    pendingPermissions,
    initializePlayer,
    getBalance,
    claimXP,
    approvePermission,
    denyPermission
  } = useCrossGameWallet(GAMES.WALLET_ADVENTURE);

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
    }

    // Initialize cross-game wallet if player name exists
    const playerName = localStorage.getItem('player_name');
    if (playerName) {
      initializePlayer(playerName);
    }
  }, [initializePlayer]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleStartGame = () => {
    // Prompt for player name if not set
    const playerName = localStorage.getItem('player_name');
    if (!playerName) {
      const name = prompt('Enter your player name for cross-game sync:');
      if (name) {
        localStorage.setItem('player_name', name);
        initializePlayer(name);
      }
    }
    setGameState('map');
  };

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
    setGameState('level');
  };

  const handleCompleteLevel = (levelData) => {
    const newProgress = {
      ...progress,
      xp: progress.xp + levelData.xp,
      completedLevels: [...new Set([...progress.completedLevels, levelData.id])],
      badges: [...progress.badges, levelData.badge],
      currentLevel: Math.max(progress.currentLevel, levelData.id + 1)
    };
    setProgress(newProgress);

    // Claim XP to cross-game wallet
    if (crossGameWallet) {
      claimXP(GAMES.WALLET_ADVENTURE, levelData.xp);
    }

    // Show unified XP claim screen
    setXpClaimData({
      game: GAMES.WALLET_ADVENTURE,
      xp: levelData.xp,
      reason: `Completed: ${currentLevel?.title}`,
      badge: levelData.badge
    });
    setGameState('xp-claim');
  };

  const handleXPClaimed = () => {
    setXpClaimData(null);
    setGameState('dashboard');
  };

  const handleBackToMap = () => {
    setGameState('map');
  };

  const handleViewDashboard = () => {
    setGameState('dashboard');
  };

  const handleGameComplete = () => {
    setGameState('complete');
  };

  return (
    <div className="min-h-screen">
      {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
      {gameState === 'map' && (
        <GameMap
          progress={progress}
          onSelectLevel={handleSelectLevel}
          onViewDashboard={handleViewDashboard}
          onGameComplete={handleGameComplete}
        />
      )}
      {gameState === 'level' && (
        <LevelGame
          level={currentLevel}
          onComplete={handleCompleteLevel}
          onBack={handleBackToMap}
        />
      )}
      {gameState === 'dashboard' && (
        <ProgressDashboard
          progress={progress}
          onBack={handleBackToMap}
        />
      )}
      {gameState === 'complete' && <CompletionScreen progress={progress} />}
      
      {/* Cross-game permission popup */}
      {pendingPermissions.length > 0 && (
        <CrossGamePermissionPopup
          permissions={pendingPermissions}
          onApprove={approvePermission}
          onDeny={denyPermission}
          currentBalance={getBalance()}
        />
      )}

      {/* Unified XP claim screen */}
      {gameState === 'xp-claim' && xpClaimData && (
        <UnifiedXPClaim
          xpData={xpClaimData}
          onClaim={handleXPClaimed}
        />
      )}

      <Toaster richColors position="top-center" />
    </div>
  );
}