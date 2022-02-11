import { PolkadotjsWallet } from './polkadotjs-wallet';
import { SubWallet } from './subwallet';
import { Wallet } from './types';

// Add new wallets here
const supportedWallets = [new SubWallet(), new PolkadotjsWallet()];

export function getWallets(): Wallet[] {
  return supportedWallets;
}

export function getWalletBySource(
  source: string | unknown
): Wallet | undefined {
  return supportedWallets.find((wallet) => {
    return wallet.extensionName === source;
  });
}

export function isWalletInstalled(source: string | unknown): boolean {
  const wallet = getWalletBySource(source);
  return wallet?.installed as boolean;
}
