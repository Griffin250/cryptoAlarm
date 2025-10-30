from fastapi import APIRouter, HTTPException
from binance.client import Client
from binance.exceptions import BinanceAPIException
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

@router.post("/verify-binance")
async def verify_binance_keys(api_key: str, api_secret: str):
    try:
        # Try to create a client with the provided keys
        client = Client(api_key, api_secret)
        # Test the connection by getting account info
        client.get_account()
        return {"success": True, "message": "API keys verified successfully"}
    except BinanceAPIException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/binance-balances")
async def get_binance_balances(api_key: str, api_secret: str):
    try:
        client = Client(api_key, api_secret)
        account = client.get_account()
        
        # Filter out zero balances and format response
        balances = [
            {
                "symbol": balance["asset"],
                "balance": float(balance["free"]) + float(balance["locked"])
            }
            for balance in account["balances"]
            if float(balance["free"]) + float(balance["locked"]) > 0
        ]
        
        return balances
    except BinanceAPIException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))