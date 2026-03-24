-- Web3 Wallet Adventure - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    "txHash" TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    recipient TEXT NOT NULL,
    "gasLevel" TEXT NOT NULL,
    "gasCost" INTEGER NOT NULL,
    timestamp BIGINT NOT NULL,
    status TEXT NOT NULL,
    "confirmTime" INTEGER NOT NULL,
    "userId" TEXT DEFAULT 'demo_user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    "userId" TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    "completedLevels" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    badges TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentLevel" INTEGER DEFAULT 1,
    "walletBalance" INTEGER DEFAULT 1000,
    "totalGasSpent" INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (educational demo)
-- In production, you'd want proper authentication
CREATE POLICY "Allow all operations on transactions"
ON transactions FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on user_progress"
ON user_progress FOR ALL
USING (true)
WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_progress
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo user progress (optional)
INSERT INTO user_progress ("userId", xp, "completedLevels", badges, "currentLevel", "walletBalance", "totalGasSpent")
VALUES ('demo_user', 0, ARRAY[]::INTEGER[], ARRAY[]::TEXT[], 1, 1000, 0)
ON CONFLICT ("userId") DO NOTHING;

-- Check if tables were created successfully
SELECT 
    'transactions' as table_name,
    COUNT(*) as row_count
FROM transactions
UNION ALL
SELECT 
    'user_progress' as table_name,
    COUNT(*) as row_count
FROM user_progress;
