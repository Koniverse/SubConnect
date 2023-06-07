// Copyright 2017-2022 @subwallet/wagmi-connector authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {Chain, ConnectorNotFoundError, InjectedConnector, InjectedConnectorOptions, WindowProvider} from '@wagmi/core';
import { UserRejectedRequestError, ResourceUnavailableRpcError, RpcError, getAddress } from 'viem'

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

  override async connect ({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();

      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      this.emit('message', { type: 'connecting' });

      const account = await this.getAccount();
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);

        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (e) {
      if (this.isUserRejectedRequestError(e)) {
        throw new UserRejectedRequestError(e as  Error);
      }

      if ((<RpcError>e).code === -32002) {
        throw new ResourceUnavailableRpcError(e as Error);
      }

      throw e;
    }
  }

  override async getAccount(): Promise<`0x${string}`> {
    const provider = await this.getProvider()
    if (!provider)
      throw new ConnectorNotFoundError()
    let account: `0x${string}` | undefined

    try {
      account = await provider.request({ method: 'eth_accounts' })
        .then(result => getAddress(result[0]))
    }
    catch {
      console.warn('eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await provider.request({ method: 'eth_requestAccounts' })
          .then(result => getAddress(result[0]))
      }
      catch {
        console.warn('enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account)
      throw new UserRejectedRequestError(new Error('Fail to get accounts list'))

    return account
  }

  override async getProvider (): Promise<WindowProvider | undefined>  {
    if (typeof window === 'undefined') {
      return;
    }

    return Promise.resolve(window.SubWallet);
  }
}
