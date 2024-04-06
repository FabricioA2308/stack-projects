import requests
from os import getenv
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

ALPHAVANTAGE_API_KEY = getenv('API_KEY')

def sync_converter(from_currency: str, to_currency: str, price: float):
    url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={from_currency}&to_currency={to_currency}&apikey={ALPHAVANTAGE_API_KEY}"
    print(url)
    
    try:
        response = requests.get(url)
    except Exception as error:
        raise HTTPException(status_code=400, detail=error)
    
    data = response.json()
    print(data)
    
    if "Realtime Currency Exchange Rate" not in data:
        raise HTTPException(status_code=400, detail="Realtime currency exchange data not in response.")
    
    exchange_rate = float(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
    
    return price * exchange_rate
        