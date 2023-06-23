// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WalletConnectWalletInfo } from '@subwallet/wallet-connect/types';

// @ts-ignore
import WalletConnectLogo from './WalletConnectLogo.svg';

export const PREDEFINED_WALLET_CONNECT_WALLETS: WalletConnectWalletInfo[] = [
  {
    extensionName: 'wallet-connect',
    title: 'Wallet Connect',
    logo: {
      src: WalletConnectLogo as string,
      alt: 'Wallet Connect'
    },
  }
];
