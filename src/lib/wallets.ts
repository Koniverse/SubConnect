import { PolkadotjsWallet } from './polkadotjs-wallet';
import { SubWallet } from './subwallet';
import { Wallet } from './types';
import { TalismanWallet } from './talisman-wallet';

// Add new wallets here
export const WALLETS: Record<string, string> = {
  'polkadot-js': 'Polkadot{.js}',
  'subwallet-js': 'SubWallet',
  'talisman': 'Talisman'
}

const supportedWallets = [new PolkadotjsWallet(), new SubWallet(), new TalismanWallet()];

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
