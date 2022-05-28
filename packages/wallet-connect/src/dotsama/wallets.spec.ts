// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { addWallet, getWalletBySource, getWallets } from '@subwallet/wallet-connect/dotsama/wallets';
import { WalletInfo } from '@subwallet/wallet-connect/types';

describe('Test Wallets Methods', () => {
  it('Test getWallets', () => {
    const wallets = getWallets();

    expect(wallets.length).toEqual(3);
  });

  it('Test getWalletBySource', () => {
    expect(getWalletBySource('subwallet-js')?.title).toEqual('SubWallet');
    expect(getWalletBySource('polkadot-js')?.title).toEqual('Polkadot{.js}');
  });

  it('Test addWallet', () => {
    const walletInfo = {
      title: 'Custom',
      extensionName: 'custom-wallet',
      installUrl: '',
      logo: {
        src: '',
        alt: 'Custom'
      }
    } as WalletInfo;

    addWallet(walletInfo);
    const wallets = getWallets();

    expect(wallets.length).toEqual(4);
    expect(getWalletBySource(walletInfo.extensionName)?.title).toEqual(walletInfo.title);
  });
});
