import { Wallet, WalletAccount } from '@subwallet/wallet-connect/src/types';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import React from 'react';
export interface WalletContextInterface {
    wallet?: Wallet;
    evmWallet?: EvmWallet;
    accounts: WalletAccount[];
    setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate' | 'evm') => void;
    walletType: 'substrate' | 'evm';
}
export declare const WalletContext: React.Context<WalletContextInterface>;
interface OpenSelectWalletInterface {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}
export declare const OpenSelectWallet: React.Context<OpenSelectWalletInterface>;
export {};
