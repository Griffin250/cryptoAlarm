// Type declarations for the runtime JS walletService at client/lib/walletService.js

interface Balance {
  symbol: string;
  balance: number;
}

interface WalletConnectResult {
  success: boolean;
  address?: string;
  balances?: Balance[];
  message?: string;
}

declare const walletService: {
  connectBinanceWallet(apiKey: string, apiSecret: string): Promise<WalletConnectResult>;
  connectPhantomWallet(): Promise<WalletConnectResult>;
  connectCoinbaseWallet(): Promise<WalletConnectResult>;
  getWalletBalances(type: string | undefined, address?: string): Promise<{ success: boolean; balances?: Balance[] }>;
  disconnectWallet(walletId: number): Promise<{ success: boolean }>;
};

export { walletService };
