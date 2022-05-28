// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This file is get idea from https://github.com/TalismanSociety/talisman-connect/blob/master/libs/wallets/src/lib/wallets.ts

import { BaseDotSamaWallet } from '@subwallet/wallet-connect/dotsama/BaseDotSamaWallet';
import { PREDEFINED_WALLETS } from '@subwallet/wallet-connect/dotsama/predefinedWallet';
import { Wallet, WalletInfo } from '@subwallet/wallet-connect/types';

const walletList: Wallet[] = [];

// Add more wallet, please sure you call this method before any getWallets or getWalletBySource
export function addWallet (data: WalletInfo) {
  const wallet = (new BaseDotSamaWallet(data)) as Wallet;

  walletList.push(wallet);
}

// Implement predefined wallets
PREDEFINED_WALLETS.forEach((walletInfo) => {
  addWallet(walletInfo);
});

// Get all wallet
export function getWallets (): Wallet[] {
  return walletList;
}

export function getWalletBySource (source: string | unknown): Wallet | undefined {
  return getWallets().find((wallet) => {
    return wallet.extensionName === source;
  });
}

export function isWalletInstalled (source: string | unknown): boolean {
  const wallet = getWalletBySource(source);

  return wallet?.installed as boolean;
}
