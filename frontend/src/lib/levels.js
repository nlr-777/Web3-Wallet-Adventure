export const LEVELS = [
  {
    id: 1,
    title: 'Seed Phrase Magic',
    description: 'Arrange 12 magic words in the correct order to open your wallet!',
    icon: '🔑',
    xp: 60,
    badge: 'Seed Guardian',
    type: 'seed-phrase',
    tip: '💡 Seed phrases are secret words — never share them! They unlock your wallet like a magic key.',
    samQuote: '"Wallets are like magic backpacks — only you have the key!"'
  },
  {
    id: 2,
    title: 'Receive Coins',
    description: 'Solve a riddle to receive fake coins from your friend NPC!',
    icon: '💰',
    xp: 60,
    badge: 'Coin Collector',
    type: 'receive-coins',
    tip: '💡 Your wallet address is like your mailbox — anyone can send you coins if they know it!',
    samQuote: '"Getting coins is easy, but keeping them safe? That\'s the adventure!"'
  },
  {
    id: 3,
    title: 'Send Safely',
    description: 'Choose the correct address to send coins and avoid scammer traps!',
    icon: '📤',
    xp: 60,
    badge: 'Safe Sender',
    type: 'send-safely',
    tip: '💡 Always double-check addresses before sending! Scammers try to trick you with fake addresses.',
    samQuote: '"Real friends don\'t ask for your seed phrase. That\'s how you spot the bad guys!"'
  },
  {
    id: 4,
    title: 'Smart Contract Promise',
    description: 'Sign a fake promise trade using an if-then button puzzle!',
    icon: '📜',
    xp: 60,
    badge: 'Contract Master',
    type: 'smart-contract',
    tip: '💡 Smart contracts are like robot promises — they automatically do what they say!',
    samQuote: '"A smart contract is a promise that keeps itself. No one can break it!"'
  },
  {
    id: 5,
    title: 'Decentralized Escape',
    description: 'Use your wallet to escape a centralized trap with a voting mini-game!',
    icon: '🗳️',
    xp: 60,
    badge: 'Freedom Fighter',
    type: 'decentralized-escape',
    tip: '💡 Decentralized means no one boss controls it — everyone has a say!',
    samQuote: '"When everyone works together, no single bad guy can control the game!"'
  }
];

export const getLevel = (id) => LEVELS.find(level => level.id === id);