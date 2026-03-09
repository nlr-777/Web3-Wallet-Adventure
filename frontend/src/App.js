import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import StartScreen from './components/StartScreen';
import GameMap from './components/GameMap';
import LevelGame from './components/LevelGame';
import ProgressDashboard from './components/ProgressDashboard';
import CompletionScreen from './components/CompletionScreen';
import { loadProgress, saveProgress } from './lib/storage';

export default function App() {
  const [gameState, setGameState] = useState('start'); // start, map, level, dashboard, complete
  const [currentLevel, setCurrentLevel] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0,
    completedLevels: [],
    badges: [],
    currentLevel: 1
  });

  useEffect(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
    }
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const handleStartGame = () => {
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
      <Toaster richColors position="top-center" />
    </div>
  );
}