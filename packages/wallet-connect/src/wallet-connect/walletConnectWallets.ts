// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PREDEFINED_WALLET_CONNECT_WALLETS } from './predefinedWallet';
import { WalletConnectWallet } from "../types";
import { BaseWalletConnectWallet } from "./BaseWalletConnectWallet";

const walletConnectWallets: WalletConnectWallet[] = [];

PREDEFINED_WALLET_CONNECT_WALLETS.forEach((data) => {
  walletConnectWallets.push(new BaseWalletConnectWallet(data));
});

export function getWalletConnectWallets () {
  return walletConnectWallets;
}

export function getWalletConnectWalletBySource (source: string | unknown): WalletConnectWallet | undefined {
  return getWalletConnectWallets().find((wallet) => {
    return wallet.extensionName === source;
  });
}
