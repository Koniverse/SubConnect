import React from 'react';
import { Wallet, WalletAccount } from '../lib/types';


interface WalletContextInterface {
  wallet: Wallet | undefined,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | undefined) => void
}

export const WalletContext = React.createContext<WalletContextInterface>({
  wallet: undefined,
  accounts: [],
  setWallet: (wallet) => {}
});


interface OpenSelectWalletInterface {
  isOpen: boolean,
  open: () => void
  close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
  isOpen: false,
  open: () => {
  },
  close: () => {
  }
});