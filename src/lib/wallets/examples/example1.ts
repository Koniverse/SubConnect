import { getWallets } from '../wallets';
import { Wallet } from '../types';

// Get all supported wallets
const supportedWallets: Wallet[] = getWallets();

// Enable each supported wallet.
supportedWallets.forEach((wallet) => {
  if (wallet.installed) {
    wallet.enable();
  }
});