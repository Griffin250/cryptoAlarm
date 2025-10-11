 #This example uses Python 2.7 and the python-request library.

from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json

url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
parameters = {
  'start':'1',
  'limit':'20',
  'convert':'USD'
}
headers = {
  'Accepts': 'application/json',
  'X-CMC_PRO_API_KEY': '5cf0cc11-ab66-4e29-af2d-800d0a5bae7f',
}

session = Session()
session.headers.update(headers)

try:
  response = session.get(url, params=parameters)
  data = json.loads(response.text)
  
  # Display top 20 cryptocurrencies with prices
  print("🚀 TOP 20 CRYPTOCURRENCIES")
  print("=" * 50)
  print(f"{'Rank':<4} {'Name':<15} {'Symbol':<8} {'Price (USD)':<15}")
  print("-" * 50)
  
  if 'data' in data:
    for crypto in data['data']:
      rank = crypto['cmc_rank']
      name = crypto['name'][:14]  # Truncate long names
      symbol = crypto['symbol']
      price = crypto['quote']['USD']['price']
      
      print(f"{rank:<4} {name:<15} {symbol:<8} ${price:,.4f}")
  else:
    print("No cryptocurrency data found in response")
    print("Full response:", data)
    
except (ConnectionError, Timeout, TooManyRedirects) as e:
  print(f"Error: {e}")