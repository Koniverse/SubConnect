// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  SubstrateWallet,
  Wallet,
  WalletAccount,
  WalletConnectWallet,
  WalletType
} from '@subwallet/wallet-connect/src/types';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import React from 'react';

export interface WalletContextInterface {
  wallet?: SubstrateWallet,
  evmWallet?: EvmWallet,
  walletConnectWallet?: WalletConnectWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | undefined, walletType: WalletType) => void
  walletType: 'substrate'|'evm';
}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet, walletType: WalletType) => {},
  walletType: 'substrate'
});

interface OpenSelectWalletInterface {
  isOpen: boolean,
  open: () => void
  close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {}
});
