import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { Users, Crown, Lock } from 'lucide-react';

const VOTING_OPTIONS = [
  {
    id: 1,
    option: 'Escape through the North Gate',
    emoji: '🧭',
    votes: 0,
    isCorrect: true
  },
  {
    id: 2,
    option: 'Wait for the boss to decide',
    emoji: '👑',
    votes: 0,
    isCorrect: false
  },
  {
    id: 3,
    option: 'Ask permission first',
    emoji: '🔒',
    votes: 0,
    isCorrect: false
  }
];

const ALLIES = [
  { id: 1, name: 'Ally 1', emoji: '🧑', voted: false },
  { id: 2, name: 'Ally 2', emoji: '🧑‍🦰', voted: false },
  { id: 3, name: 'Ally 3', emoji: '🧑‍🦱', voted: false },
  { id: 4, name: 'Ally 4', emoji: '🧑‍🦳', voted: false }
];

export default function DecentralizedEscapeGame({ level, onComplete }) {
  const [votingOptions, setVotingOptions] = useState(VOTING_OPTIONS);
  const [allies, setAllies] = useState(ALLIES);
  const [userVoted, setUserVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleVote = (optionId) => {
    if (userVoted) return;

    setSelectedOption(optionId);
    setUserVoted(true);

    // Simulate allies voting
    setTimeout(() => {
      const updatedOptions = votingOptions.map(option => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      // Simulate ally votes (3 allies vote for correct option, 1 votes randomly)
      const alliesVoting = [...updatedOptions];
      alliesVoting[0].votes += 3; // North Gate gets 3 votes
      alliesVoting[1].votes += 1; // Boss gets 1 vote

      setVotingOptions(alliesVoting);

      // Mark allies as voted
      const votedAllies = allies.map(ally => ({ ...ally, voted: true }));
      setAllies(votedAllies);

      setTimeout(() => {
        setShowResults(true);
      }, 1500);
    }, 1000);
  };

  const handleEscape = () => {
    const winningOption = votingOptions.reduce((prev, current) =>
      current.votes > prev.votes ? current : prev
    );

    if (winningOption.isCorrect) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      toast.success(`🎉 Freedom Achieved! +${level.xp} XP | Badge: ${level.badge}`);
      setTimeout(() => {
        onComplete({ id: level.id, xp: level.xp, badge: level.badge });
      }, 2000);
    } else {
      toast.error('The group chose poorly! Try voting for freedom!');
      // Reset
      setVotingOptions(VOTING_OPTIONS);
      setAllies(ALLIES);
      setUserVoted(false);
      setSelectedOption(null);
      setShowResults(false);
    }
  };

  const totalVotes = votingOptions.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card className="p-6 space-y-6">
      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Escape the Centralized Trap!</h2>
        <p className="text-muted-foreground text-sm">Vote with your allies to decide the escape route</p>
      </div>

      {/* Scenario */}
      <Card className="p-4 bg-destructive/10 border-2 border-destructive/30">
        <div className="flex items-start gap-3">
          <Lock className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold text-destructive mb-2">The Trap</p>
            <p className="text-sm text-foreground/80">
              You and your allies are trapped in a castle controlled by a single boss! In a centralized system,
              only the boss decides. But with decentralization, everyone gets a vote! 🗳️
            </p>
          </div>
        </div>
      </Card>

      {/* Allies Status */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Your Team ({allies.length + 1} members):</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          <Card className="p-3 bg-primary/10 border-2 border-primary text-center">
            <div className="text-3xl mb-1">👤</div>
            <p className="text-xs font-semibold text-foreground">You</p>
            {userVoted && <p className="text-xs text-success mt-1">✓ Voted</p>}
          </Card>
          {allies.map(ally => (
            <Card key={ally.id} className="p-3 text-center">
              <div className="text-3xl mb-1">{ally.emoji}</div>
              <p className="text-xs font-semibold text-foreground">{ally.name}</p>
              {ally.voted && <p className="text-xs text-success mt-1">✓ Voted</p>}
            </Card>
          ))}
        </div>
      </div>

      {/* Voting Options */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">Cast Your Vote:</p>
        {votingOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: userVoted ? 1 : 1.02 }}
            whileTap={{ scale: userVoted ? 1 : 0.98 }}
          >
            <Card
              className={`p-4 transition-all ${
                userVoted
                  ? selectedOption === option.id
                    ? 'border-2 border-primary bg-primary/5'
                    : 'opacity-70'
                  : 'cursor-pointer border-2 border-border hover:border-primary/50'
              }`}
              onClick={() => !userVoted && handleVote(option.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="font-semibold text-foreground">{option.option}</span>
                  </div>
                  {showResults && (
                    <span className="text-lg font-bold text-primary">{option.votes} votes</span>
                  )}
                </div>
                {showResults && (
                  <Progress value={(option.votes / totalVotes) * 100} className="h-2" />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Explanation */}
      <Card className="p-4 bg-accent/10 border-2 border-accent/30">
        <div className="space-y-2">
          <p className="font-bold text-accent text-sm">💡 What is Decentralization?</p>
          <p className="text-xs text-foreground/80 leading-relaxed">
            In a <strong>centralized</strong> system, one boss controls everything. In a <strong>decentralized</strong> system,
            everyone votes and the majority decides! No single person has all the power. That's why Web3 is safer
            and fairer! 🌐
          </p>
        </div>
      </Card>

      {/* Action Button */}
      {!userVoted ? (
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click an option above to cast your vote
          </p>
        </div>
      ) : !showResults ? (
        <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-sm font-semibold text-primary"
          >
            ⏳ Waiting for allies to vote...
          </motion.p>
        </div>
      ) : (
        <Button
          onClick={handleEscape}
          className="w-full btn-adventure text-lg"
          size="lg"
          style={{ background: 'var(--gradient-button)' }}
        >
          🏃 Execute Majority Decision
        </Button>
      )}
    </Card>
  );
}