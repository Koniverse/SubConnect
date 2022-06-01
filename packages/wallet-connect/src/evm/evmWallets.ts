// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseEvmWallet } from '@subwallet/wallet-connect/evm/BaseEvmWallet';
import { PREDEFINED_EVM_WALLETS } from '@subwallet/wallet-connect/evm/predefinedWallet';
import { EvmWallet, EvmWalletInfo } from '@subwallet/wallet-connect/types';

const evmWallets: EvmWallet[] = [];

// Add more wallet, please sure you call this method before any getEvmWallets or getEvmWalletBySource
export function addEvmWallet (data: EvmWalletInfo) {
  const wallet = (new BaseEvmWallet(data)) as EvmWallet;

  evmWallets.push(wallet);
}

PREDEFINED_EVM_WALLETS.forEach((data) => {
  evmWallets.push(new BaseEvmWallet(data));
});

export function getEvmWallets () {
  return evmWallets;
}

export function getEvmWalletBySource (source: string | unknown): EvmWallet | undefined {
  return getEvmWallets().find((wallet) => {
    return wallet.extensionName === source;
  });
}

export function isEvmWalletInstalled (source: string | unknown): boolean {
  const wallet = getEvmWalletBySource(source);

  return wallet?.installed as boolean;
}
