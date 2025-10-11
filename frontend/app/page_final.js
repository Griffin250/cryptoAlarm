"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { TrendingUp, TrendingDown, Phone, Wifi, WifiOff, Star } from "lucide-react";

// Crypto info mapping
const cryptoInfo = {
  BTCUSDT: { name: "Bitcoin", symbol: "BTC", icon: "₿" },
  ETHUSDT: { name: "Ethereum", symbol: "ETH", icon: "Ξ" },
  SOLUSDT: { name: "Solana", symbol: "SOL", icon: "◎" },
  XRPUSDT: { name: "XRP", symbol: "XRP", icon: "✗" },
};

export default function Home() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const previousPricesRef = useRef({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await api.get("/prices");
        const newPrices = res.data.prices || {};
        
        // Store current prices as previous before updating
        previousPricesRef.current = { ...prices };
        setPrices(newPrices);
        setIsConnected(true);
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Failed to fetch prices:", err);
        setIsConnected(false);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 2000);
    return () => clearInterval(interval);
  }, [prices]);

  const triggerAlert = async () => {
    setLoading(true);
    try {
      await api.get("/test-alert");
      setAlertMsg("success");
      setTimeout(() => setAlertMsg(""), 5000);
    } catch {
      setAlertMsg("error");
      setTimeout(() => setAlertMsg(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getPriceChange = (symbol, currentPrice) => {
    const prevPrice = previousPricesRef.current[symbol];
    if (!prevPrice || prevPrice === currentPrice) return { change: 0, trend: "neutral" };
    
    const change = ((currentPrice - prevPrice) / prevPrice) * 100;
    return {
      change: change.toFixed(2),
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral"
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">CryptoAlarm</h1>
              <Badge variant="outline" className="text-xs">
                Live Data
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
              <Button onClick={triggerAlert} disabled={loading} size="sm">
                <Phone className="h-4 w-4 mr-2" />
                {loading ? "Calling..." : "Test Alert"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Messages */}
      {alertMsg && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant={alertMsg === "success" ? "default" : "destructive"}>
            <AlertDescription>
              {alertMsg === "success" 
                ? "📞 Voice alert sent successfully! Your phone should ring shortly." 
                : "⚠️ Failed to send alert. Please check your connection and try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4T</div>
              <div className="text-xs text-red-500 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                2.86%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">24h Vol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$217.1B</div>
              <div className="text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.62%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fear & Greed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54</div>
              <div className="text-xs text-yellow-500">Neutral</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Update</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crypto Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Prices</span>
              <Badge variant="secondary" className="text-xs">
                {Object.keys(prices).length} Assets
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(prices).map(([symbol, price], index) => {
                const crypto = cryptoInfo[symbol] || { name: symbol, symbol: symbol, icon: "?" };
                const priceChange = getPriceChange(symbol, price);
                
                return (
                  <div
                    key={symbol}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-muted-foreground hover:text-yellow-500 cursor-pointer" />
                        <span className="text-muted-foreground w-6 text-center">{index + 1}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {crypto.icon}
                        </div>
                        <div>
                          <div className="font-semibold">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {formatPrice(price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${price.toFixed(2)}
                        </div>
                      </div>

                      {priceChange.change !== 0 && (
                        <div className={`flex items-center space-x-1 ${
                          priceChange.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                          {priceChange.trend === "up" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {Math.abs(priceChange.change)}%
                          </span>
                        </div>
                      )}

                      <div className="w-20 h-8 bg-muted rounded flex items-center justify-center">
                        <div className={`w-full h-1 rounded ${
                          priceChange.trend === "up" ? "bg-green-500" : 
                          priceChange.trend === "down" ? "bg-red-500" : "bg-muted-foreground"
                        }`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(prices).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-lg font-medium mb-2">Waiting for price data...</div>
                <div className="text-sm">Make sure your backend is running on port 8000</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}