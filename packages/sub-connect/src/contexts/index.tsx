// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet, WalletAccount } from '@subwallet/wallet-connect/src/types';
import React from 'react';

interface WalletContextInterface {
  wallet: Wallet | undefined,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | undefined) => void
}

export const WalletContext = React.createContext<WalletContextInterface>({
  wallet: undefined,
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet) => {}
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
