export const LEVELS = [
  {
    id: 1,
    title: 'Icon Seed Phrase Adventure',
    description: 'Create your wallet with fun icons and help Gary the Goat recover his!',
    icon: '🔐',
    xp: 80,
    badge: 'Icon Guardian',
    type: 'icon-seed-phrase',
    tip: '💡 Seed phrases with icons are easier to remember but just as secure! Never share them!',
    samQuote: '"Icons make it fun, but keeping them secret is still #1!"'
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
    title: 'Send with Gas Fees',
    description: 'Choose the correct address and gas fee to send coins safely!',
    icon: '📤',
    xp: 70,
    badge: 'Safe Sender',
    type: 'send-safely',
    tip: '💡 Always double-check addresses before sending! And choose your gas fee wisely.',
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
    title: 'Vault Your Treasure',
    description: 'Store coins in your secure vault with transaction simulation!',
    icon: '🏦',
    xp: 70,
    badge: 'Vault Master',
    type: 'vault-storage',
    tip: '💡 Vaults keep your coins extra safe! Like a bank, but you control the keys.',
    samQuote: '"Keep your treasure locked up tight. Safety first, always!"'
  }
];

export const getLevel = (id) => LEVELS.find(level => level.id === id);