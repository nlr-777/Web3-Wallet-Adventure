from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from supabase import create_client, Client

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

# Initialize Supabase
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

class Transaction(BaseModel):
    id: str
    txHash: str
    type: str  # send, vault, backup, reward
    amount: int
    recipient: str
    gasLevel: str
    gasCost: int
    timestamp: int
    status: str
    confirmTime: int
    userId: Optional[str] = "demo_user"

class UserProgress(BaseModel):
    userId: str
    xp: int
    completedLevels: List[int]
    badges: List[str]
    currentLevel: int
    walletBalance: int
    totalGasSpent: int

@router.post("/log")
async def log_transaction(transaction: Transaction):
    """Log a transaction to Supabase"""
    try:
        data = transaction.dict()
        result = supabase.table('transactions').insert(data).execute()
        
        return {
            "success": True,
            "message": "Transaction logged successfully",
            "txHash": transaction.txHash,
            "data": result.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log transaction: {str(e)}")

@router.get("/history/{user_id}")
async def get_transaction_history(user_id: str, limit: int = 100):
    """Get transaction history for a user"""
    try:
        result = (supabase.table('transactions')
                 .select('id,txHash,type,amount,recipient,gasLevel,gasCost,timestamp,status')
                 .eq('userId', user_id)
                 .order('timestamp', desc=True)
                 .limit(limit)
                 .execute())
        
        return {
            "success": True,
            "transactions": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {str(e)}")

@router.get("/stats/{user_id}")
async def get_wallet_stats(user_id: str):
    """Get wallet statistics"""
    try:
        result = supabase.table('transactions').select("*").eq('userId', user_id).execute()
        user_txs = result.data
        
        total_sent = sum(tx["amount"] for tx in user_txs if tx["type"] == "send")
        total_gas_spent = sum(tx["gasCost"] for tx in user_txs)
        total_rewards = sum(tx["amount"] for tx in user_txs if tx["type"] == "reward")
        
        return {
            "success": True,
            "stats": {
                "totalTransactions": len(user_txs),
                "totalSent": total_sent,
                "totalGasSpent": total_gas_spent,
                "totalRewards": total_rewards
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")

@router.post("/progress/save")
async def save_progress(progress: UserProgress):
    """Save user progress to Supabase"""
    try:
        data = progress.dict()
        
        # Upsert - update if exists, insert if not
        result = supabase.table('user_progress').upsert(data, on_conflict='userId').execute()
        
        return {
            "success": True,
            "message": "Progress saved successfully",
            "data": result.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save progress: {str(e)}")

@router.get("/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress from Supabase"""
    try:
        result = supabase.table('user_progress').select("*").eq('userId', user_id).execute()
        
        if result.data and len(result.data) > 0:
            return {
                "success": True,
                "progress": result.data[0]
            }
        else:
            return {
                "success": True,
                "progress": None
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch progress: {str(e)}")
