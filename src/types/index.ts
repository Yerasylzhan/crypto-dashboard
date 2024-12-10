export interface CryptoPair {
    id: number;
    baseCurrency: string;
    quoteCurrency: string;
    isActive: boolean;
    updateInterval: number;
  }
  
  export interface CryptoRate {
    id: number;
    pairId: number;
    rate: number;
    timestamp: string;
  }