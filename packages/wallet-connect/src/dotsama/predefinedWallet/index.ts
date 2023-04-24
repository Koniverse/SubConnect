// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WalletInfo } from '@subwallet/wallet-connect/types';

// @ts-ignore
import FearlessWalletLogo from './FearlessWalletLogo.svg';
// @ts-ignore
import PolkadotJsLogo from './PolkadotLogo.svg';
// @ts-ignore
import SubWalletLogo from './SubWalletLogo.svg';
// @ts-ignore
import TalismanLogo from './TalismanLogo.svg';

export const PREDEFINED_WALLETS: WalletInfo[] = [
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    logo: {
      src: SubWalletLogo as string,
      alt: 'SubWallet'
    }
  },
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    logo: {
      src: PolkadotJsLogo as string,
      alt: 'Polkadot{.js} Extension'
    }
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    logo: {
      src: TalismanLogo as string,
      alt: 'Talisman'
    }
  },
  {
    extensionName: 'fearless-wallet',
    title: 'Fearless Wallet',
    installUrl: 'https://chrome.google.com/webstore/detail/fearless-wallet/nhlnehondigmgckngjomcpcefcdplmgc',
    logo: {
      src: FearlessWalletLogo as string,
      alt: 'Fearless Wallet Extension'
    }
  }
];
