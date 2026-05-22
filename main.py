from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# Allow your frontend to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

TRADIER_TOKEN = os.getenv("TRADIER_TOKEN")
HEADERS = {
    'Authorization': f'Bearer {TRADIER_TOKEN}',
    'Accept': 'application/json'
}

class ScanRequest(BaseModel):
    ticker: str
    target_yield: float = 0.005  # 0.5%
    downside_protection: float = 0.10  # 10%

@app.post("/scan")
def scan_options(request: ScanRequest):
    ticker = request.ticker.upper()
    
    # 1. Fetch current stock price
    quote_url = f"https://sandbox.tradier.com/v1/markets/quotes?symbols={ticker}"
    quote_resp = requests.get(quote_url, headers=HEADERS)
    quote_data = quote_resp.json()
    
    try:
        current_price = quote_data['quotes']['quote']['last']
    except (KeyError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid ticker or Tradier API error")

    # 2. Fetch expiration dates
    exp_url = f"https://sandbox.tradier.com/v1/markets/options/expirations?symbol={ticker}"
    exp_resp = requests.get(exp_url, headers=HEADERS)
    expirations = exp_resp.json().get('expirations', {}).get('date', [])
    
    if not expirations:
        raise HTTPException(status_code=400, detail="No options found")
        
    nearest_expiry = expirations[0] 
    
    # Calculate Days to Expiration (DTE)
    exp_date = datetime.strptime(nearest_expiry, "%Y-%m-%d")
    dte = (exp_date - datetime.now()).days
    if dte <= 0: dte = 1 

    # 3. Fetch the Options Chain
    chain_url = f"https://sandbox.tradier.com/v1/markets/options/chains?symbol={ticker}&expiration={nearest_expiry}"
    chain_resp = requests.get(chain_url, headers=HEADERS)
    options = chain_resp.json().get('options', {}).get('option', [])
    
    valid_trades = []
    
    # 4. The Math Engine
    for opt in options:
        if opt['option_type'] != 'call' or opt['bid'] == 0:
            continue
            
        strike = opt['strike']
        premium = opt['bid']
        
        net_debit = current_price - premium
        max_profit = strike - net_debit
        
        if net_debit <= 0: continue
            
        net_yield = max_profit / net_debit
        weekly_yield = net_yield * (7 / dte)
        downside = (current_price - strike) / current_price
        
        # Filter strictly by your rules
        if weekly_yield >= request.target_yield and downside >= request.downside_protection:
            valid_trades.append({
                "strike": strike,
                "premium": premium,
                "net_debit": round(net_debit, 2),
                "max_profit": round(max_profit, 2),
                "weekly_yield": round(weekly_yield * 100, 2), 
                "downside_protection": round(downside * 100, 2)
            })
            
    # Sort with the highest yield at the top
    valid_trades.sort(key=lambda x: x['weekly_yield'], reverse=True)
    
    return {
        "ticker": ticker,
        "current_price": current_price,
        "expiration": nearest_expiry,
        "dte": dte,
        "opportunities": valid_trades[:5] # Return the top 5 matches
    }