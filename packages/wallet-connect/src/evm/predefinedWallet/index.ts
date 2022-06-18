// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EvmWalletInfo } from '@subwallet/wallet-connect/types';

// @ts-ignore
import MetaMaskLogo from './MetaMaskLogo.svg';
// @ts-ignore
import SubWalletLogo from './SubWalletLogo.svg';

export const PREDEFINED_EVM_WALLETS: EvmWalletInfo[] = [
  {
    extensionName: 'SubWallet',
    title: 'SubWallet (EVM)',
    installUrl: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    logo: {
      src: SubWalletLogo as string,
      alt: 'SubWallet (EVM)'
    },
    isSetGlobalString: 'isSubWallet',
    initEvent: 'subwallet#initialized'
  },
  {
    extensionName: 'ethereum',
    title: 'MetaMask',
    installUrl: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    logo: {
      src: MetaMaskLogo as string,
      alt: 'MetaMask Extension'
    },
    isSetGlobalString: 'isMetaMask',
    initEvent: 'ethereum#initialized'
  }
];
