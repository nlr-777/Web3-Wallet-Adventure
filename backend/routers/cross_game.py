from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/api/cross-game", tags=["cross-game"])

# In-memory storage (use Supabase in production)
wallets_db = {}

class CrossGameWallet(BaseModel):
    playerName: str
    totalBQ: int
    games: Dict[str, Any]
    nfts: List[Dict[str, Any]]
    transactions: List[Dict[str, Any]]
    createdAt: int
    lastSynced: int

class NFTMint(BaseModel):
    playerName: str
    nftData: Dict[str, Any]
    gasCost: int
    fromGame: str

@router.post("/sync")
async def sync_wallet(wallet: CrossGameWallet):
    """Sync cross-game wallet data"""
    try:
        # Store in memory (in production, save to Supabase)
        wallets_db[wallet.playerName] = wallet.dict()
        
        return {
            "success": True,
            "message": "Wallet synced successfully",
            "playerName": wallet.playerName,
            "totalBQ": wallet.totalBQ
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync wallet: {str(e)}")

@router.get("/wallet/{player_name}")
async def get_wallet(player_name: str):
    """Get cross-game wallet for a player"""
    try:
        wallet = wallets_db.get(player_name)
        
        if wallet:
            return {
                "success": True,
                "wallet": wallet
            }
        else:
            return {
                "success": True,
                "wallet": None,
                "message": "Wallet not found"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch wallet: {str(e)}")

@router.post("/nft/mint")
async def mint_nft(mint_data: NFTMint):
    """Record NFT mint from another game"""
    try:
        wallet = wallets_db.get(mint_data.playerName)
        
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")
        
        # Check balance
        if wallet["totalBQ"] < mint_data.gasCost:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Deduct gas
        wallet["totalBQ"] -= mint_data.gasCost
        
        # Add NFT
        nft = {
            "id": f"nft_{int(datetime.now().timestamp())}",
            **mint_data.nftData,
            "mintedAt": int(datetime.now().timestamp()),
            "mintedFrom": mint_data.fromGame
        }
        wallet["nfts"].append(nft)
        
        # Add transaction
        wallet["transactions"].append({
            "id": f"tx_{int(datetime.now().timestamp())}",
            "amount": -mint_data.gasCost,
            "reason": f"nft_mint_gas_from_{mint_data.fromGame}",
            "game": mint_data.fromGame,
            "timestamp": int(datetime.now().timestamp()),
            "newBalance": wallet["totalBQ"]
        })
        
        wallet["lastSynced"] = int(datetime.now().timestamp())
        wallets_db[mint_data.playerName] = wallet
        
        return {
            "success": True,
            "message": "NFT minted successfully",
            "nft": nft,
            "newBalance": wallet["totalBQ"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mint NFT: {str(e)}")

@router.post("/xp/claim")
async def claim_xp(data: dict):
    """Claim XP from any game"""
    try:
        player_name = data.get("playerName")
        game = data.get("game")
        xp_amount = data.get("xpAmount")
        
        if not all([player_name, game, xp_amount]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        wallet = wallets_db.get(player_name)
        
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")
        
        # Update game XP
        if game not in wallet["games"]:
            wallet["games"][game] = {"xp": 0, "lastPlayed": None}
        
        wallet["games"][game]["xp"] += xp_amount
        wallet["games"][game]["lastPlayed"] = int(datetime.now().timestamp())
        wallet["lastSynced"] = int(datetime.now().timestamp())
        
        wallets_db[player_name] = wallet
        
        return {
            "success": True,
            "message": "XP claimed successfully",
            "game": game,
            "totalXP": wallet["games"][game]["xp"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to claim XP: {str(e)}")

@router.get("/leaderboard")
async def get_leaderboard(game: Optional[str] = None):
    """Get leaderboard across games"""
    try:
        players = []
        
        for player_name, wallet in wallets_db.items():
            if game:
                xp = wallet["games"].get(game, {}).get("xp", 0)
            else:
                # Total XP across all games
                xp = sum(g.get("xp", 0) for g in wallet["games"].values())
            
            players.append({
                "playerName": player_name,
                "xp": xp,
                "totalBQ": wallet["totalBQ"],
                "nfts": len(wallet.get("nfts", []))
            })
        
        # Sort by XP
        players.sort(key=lambda x: x["xp"], reverse=True)
        
        return {
            "success": True,
            "leaderboard": players[:100],  # Top 100
            "game": game or "all"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")
