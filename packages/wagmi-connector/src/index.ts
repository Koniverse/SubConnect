// Copyright 2017-2022 @subwallet/wagmi-connector authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Chain, InjectedConnector, InjectedConnectorOptions, WindowProvider } from '@wagmi/core';

export type WagmiSubConnectOptions = InjectedConnectorOptions

type WagmiConstructorParams = {
  chains?: Chain[],
  options?: WagmiSubConnectOptions
}

export class SubWalletConnector extends InjectedConnector {
  override readonly id = 'subwallet';
  override readonly ready = typeof window !== 'undefined' && !!window.SubWallet;

  constructor ({ chains, options: _options }: WagmiConstructorParams = {}) {
    super({
      chains,
      options: {
        name: 'SubWallet',
        shimDisconnect: true,
        ..._options
      }
    });
  }

  override async getProvider (): Promise<WindowProvider | undefined> {
    if (typeof window === 'undefined') {
      return;
    }

    return Promise.resolve(window.SubWallet);
  }
}
