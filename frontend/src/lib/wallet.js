// Wallet management system
export const INITIAL_BQ_TOKENS = 1000;

export const GAS_LEVELS = {
  LOW: { name: 'Low', cost: 5, time: 30, emoji: '🐢', color: 'hsl(150 100% 50%)' },
  MEDIUM: { name: 'Medium', cost: 15, time: 15, emoji: '🚗', color: 'hsl(45 95% 60%)' },
  HIGH: { name: 'High', cost: 30, time: 5, emoji: '🚀', color: 'hsl(325 100% 50%)' }
};

export const loadWallet = () => {
  try {
    const saved = localStorage.getItem('web3_wallet');
    return saved ? JSON.parse(saved) : {
      balance: INITIAL_BQ_TOKENS,
      transactions: [],
      totalGasSpent: 0
    };
  } catch (error) {
    console.error('Failed to load wallet:', error);
    return { balance: INITIAL_BQ_TOKENS, transactions: [], totalGasSpent: 0 };
  }
};

export const saveWallet = (wallet) => {
  try {
    localStorage.setItem('web3_wallet', JSON.stringify(wallet));
  } catch (error) {
    console.error('Failed to save wallet:', error);
  }
};

export const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const createTransaction = (type, amount, recipient, gasLevel) => {
  return {
    id: Date.now().toString(),
    txHash: generateTxHash(),
    type, // 'send', 'vault', 'backup', 'reward'
    amount,
    recipient,
    gasLevel: gasLevel.name,
    gasCost: gasLevel.cost,
    timestamp: Date.now(),
    status: 'pending',
    confirmTime: gasLevel.time
  };
};

export const formatBQTokens = (amount) => {
  return `${amount.toLocaleString()} BQ`;
};

export const exportTransactionHistory = (transactions) => {
  const content = transactions.map(tx => 
    `${new Date(tx.timestamp).toLocaleString()} - ${tx.type.toUpperCase()} - ${tx.amount} BQ to ${tx.recipient} - Gas: ${tx.gasCost} BQ - Status: ${tx.status} - TX: ${tx.txHash}`
  ).join('\n');
  
  return `MY WALLET DIARY\n================\n\n${content}`;
};