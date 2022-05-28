// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { addWallet } from '@subwallet/wallet-connect/dotsama/wallets';

// @ts-ignore
import SubWalletLogo from './ExampleWallet.svg';

export const doAddWallet = () => {
  addWallet({
    extensionName: 'example',
    title: 'New Wallet Example',
    installUrl: 'https://github.com/Koniverse/SubConnect/tree/master/packages/sub-connect/src/new-wallet-example',
    logo: {
      src: SubWalletLogo as string,
      alt: 'New Wallet Example'
    }
  });
};
