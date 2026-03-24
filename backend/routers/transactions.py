from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/transactions", tags=["transactions"])

# In-memory storage (in production, use MongoDB)
transactions_db = []

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

@router.post("/log")
async def log_transaction(transaction: Transaction):
    """Log a fake transaction for educational purposes"""
    transactions_db.append(transaction.dict())
    return {
        "success": True,
        "message": "Transaction logged successfully",
        "txHash": transaction.txHash
    }

@router.get("/history/{user_id}")
async def get_transaction_history(user_id: str):
    """Get transaction history for a user"""
    user_txs = [tx for tx in transactions_db if tx.get("userId") == user_id]
    return {
        "success": True,
        "transactions": user_txs,
        "count": len(user_txs)
    }

@router.get("/stats/{user_id}")
async def get_wallet_stats(user_id: str):
    """Get wallet statistics"""
    user_txs = [tx for tx in transactions_db if tx.get("userId") == user_id]
    
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
