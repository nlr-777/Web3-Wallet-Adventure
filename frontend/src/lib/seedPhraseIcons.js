// Icon-based seed phrase system for kids
export const SEED_ICONS = [
  { id: 'goat', emoji: '🐐', name: 'Goat' },
  { id: 'block', emoji: '🧱', name: 'Block' },
  { id: 'star', emoji: '⭐', name: 'Star' },
  { id: 'rocket', emoji: '🚀', name: 'Rocket' },
  { id: 'shield', emoji: '🛡️', name: 'Shield' },
  { id: 'key', emoji: '🔑', name: 'Key' },
  { id: 'treasure', emoji: '💎', name: 'Treasure' },
  { id: 'crown', emoji: '👑', name: 'Crown' },
  { id: 'lightning', emoji: '⚡', name: 'Lightning' },
  { id: 'fire', emoji: '🔥', name: 'Fire' },
  { id: 'crystal', emoji: '🔮', name: 'Crystal' },
  { id: 'sword', emoji: '⚔️', name: 'Sword' },
  { id: 'castle', emoji: '🏰', name: 'Castle' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard' },
  { id: 'dragon', emoji: '🐉', name: 'Dragon' },
  { id: 'coin', emoji: '🪙', name: 'Coin' }
];

export const generateRandomPhrase = () => {
  const shuffled = [...SEED_ICONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 12);
};

export const saveSeedPhrase = (phrase) => {
  try {
    localStorage.setItem('web3_seed_phrase', JSON.stringify(phrase));
  } catch (error) {
    console.error('Failed to save seed phrase:', error);
  }
};

export const loadSeedPhrase = () => {
  try {
    const saved = localStorage.getItem('web3_seed_phrase');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load seed phrase:', error);
    return null;
  }
};