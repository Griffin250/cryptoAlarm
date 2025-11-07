import { createClient } from '@supabase/supabase-js';

// Dynamic import for Web3 to avoid build issues
let Web3, web3;
if (typeof window !== 'undefined') {
    try {
        // Web3 = await import('web3');
        if (window.ethereum) {
            // web3 = new Web3.default(window.ethereum);
        }
    } catch (error) {
        console.warn('Web3 not available:', error);
    }
}

export class WalletService {
    constructor() {
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
    }

    // Connect Binance using API keys
    async connectBinanceWallet(apiKey, apiSecret) {
        try {
            // Verify API keys with backend
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-binance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey, apiSecret }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify Binance API keys');
            }

            // Store encrypted API keys in database
            await this.supabase.from('wallet_connections').insert({
                user_id: (await this.supabase.auth.getUser()).data.user.id,
                wallet_type: 'binance',
                encrypted_data: { apiKey },  // Store only the API key, not the secret
                status: 'active'
            });

            return {
                success: true,
                message: 'Binance wallet connected successfully'
            };
        } catch (error) {
            console.error('Binance connection error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Connect Phantom (Solana) wallet
    async connectPhantomWallet() {
        try {
            if (!window.solana || !window.solana.isPhantom) {
                throw new Error('Phantom wallet is not installed');
            }

            try {
                // Request connection to Phantom wallet
                const resp = await window.solana.connect();
                const publicKey = resp.publicKey.toString();

                // Store wallet info in database
                await this.supabase.from('wallet_connections').insert({
                    user_id: (await this.supabase.auth.getUser()).data.user.id,
                    wallet_type: 'phantom',
                    address: publicKey,
                    status: 'active'
                });

                return {
                    success: true,
                    message: 'Phantom wallet connected successfully',
                    address: publicKey
                };
            } catch (err) {
                throw new Error('Failed to connect Phantom wallet: ' + err.message);
            }
        } catch (error) {
            console.error('Phantom connection error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Connect Coinbase Wallet
    async connectCoinbaseWallet() {
        try {
            // Check if Coinbase Wallet is installed
            if (!window.ethereum?.isCoinbaseWallet) {
                throw new Error('Coinbase Wallet is not installed');
            }

            // Request account access
            const accounts = await web3.eth.requestAccounts();
            const address = accounts[0];

            // Store wallet info in database
            await this.supabase.from('wallet_connections').insert({
                user_id: (await this.supabase.auth.getUser()).data.user.id,
                wallet_type: 'coinbase',
                address: address,
                status: 'active'
            });

            return {
                success: true,
                message: 'Coinbase Wallet connected successfully',
                address: address
            };
        } catch (error) {
            console.error('Coinbase connection error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Disconnect wallet
    async disconnectWallet(walletId) {
        try {
            // Remove from database
            await this.supabase
                .from('wallet_connections')
                .update({ status: 'disconnected' })
                .eq('id', walletId);

            return {
                success: true,
                message: 'Wallet disconnected successfully'
            };
        } catch (error) {
            console.error('Wallet disconnection error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Get wallet balances
    async getWalletBalances(walletType, address) {
        try {
            let balances = [];

            switch (walletType) {
                case 'phantom':
                    // Fetch Solana balance
                    if (window.solana && window.solana.isPhantom) {
                        const connection = window.solana.connection;
                        const balance = await connection.getBalance(address);
                        balances.push({
                            symbol: 'SOL',
                            balance: balance / 1e9, // Convert lamports to SOL
                        });
                    }
                    break;

                case 'coinbase':
                    // Fetch ETH balance
                    if (web3) {
                        const balance = await web3.eth.getBalance(address);
                        balances.push({
                            symbol: 'ETH',
                            balance: web3.utils.fromWei(balance, 'ether'),
                        });
                    }
                    break;

                case 'binance':
                    // Fetch from backend which has the API keys
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/binance-balances`);
                    if (response.ok) {
                        balances = await response.json();
                    }
                    break;
            }

            return {
                success: true,
                balances
            };
        } catch (error) {
            console.error('Error fetching balances:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}

export const walletService = new WalletService();