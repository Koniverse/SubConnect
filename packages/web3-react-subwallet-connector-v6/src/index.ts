// Copyright 2019-2022 @subwallet/web3-react-subwallet-connector-v6 authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AbstractConnector } from '@web3-react/abstract-connector';
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types';
import warning from 'tiny-warning';

import { RequestResponse } from './types';

function parseRequest (response: RequestResponse): any {
  return response;
}

function parseHex (response: RequestResponse): number | undefined {
  try {
    if (typeof response === 'string') {
      return parseInt(response, 16);
    }
  } catch (e) {
    return undefined;
  }

  return 0;
}

export class NoEthereumProviderError extends Error {
  public constructor () {
    super();
    this.name = this.constructor.name;
    this.message = 'No Ethereum provider was found on window.SubWallet.';
  }
}

export class UserRejectedRequestError extends Error {
  public constructor () {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

export class SubWalletConnector extends AbstractConnector {
  constructor (kwargs: AbstractConnectorArguments) {
    super(kwargs);

    this.handleChainChanged = this.handleChainChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private handleChainChanged (chainId: string | number): void {
    this.emitUpdate({ chainId: parseHex(chainId), provider: window.SubWallet });
  }

  private handleAccountsChanged (accounts: string[]): void {
    if (accounts.length === 0) {
      this.emitDeactivate();
    } else {
      this.emitUpdate({ account: accounts[0] });
    }
  }

  private handleError (error: Error): void {
    console.error(error);
    this.emitDeactivate();
  }

  private handleClose (code: number, reason: string): void {
    this.emitDeactivate();
  }

  public async activate (): Promise<ConnectorUpdate> {
    const provider = await this.getProvider();

    if (provider?.on) {
      provider.on('chainChanged', this.handleChainChanged);
      provider.on('accountsChanged', this.handleAccountsChanged);
      provider.on('error', this.handleError);
      provider.on('close', this.handleClose);
    }

    // try to activate + get account via eth_requestAccounts
    let account;

    try {
      account = await provider?.request({ method: 'eth_requestAccounts' })
        .then((result) => (result as string[])[0]);
    } catch (error) {
      // @ts-ignore
      if (error.code === 4001) {
        throw new UserRejectedRequestError();
      }

      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable');
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      account = await provider?.request({ method: 'eth_accounts' })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then((result) => result && (result as string[])[0]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { provider, ...(account ? { account } : {}) };
  }

  public async getProvider (): Promise<Ethereum | undefined> {
    return new Promise((resolve, reject) => {
      if (window.SubWallet) {
        resolve(window.SubWallet);
      } else {
        const throwNoEthereumError = setTimeout(() => {
          reject(new NoEthereumProviderError());
        }, 3000);

        window.addEventListener('subwallet#initialized', () => {
          clearTimeout(throwNoEthereumError);

          resolve(window.SubWallet);
        });
      }
    });
  }

  public async getChainId (): Promise<number | string> {
    const provider = await this.getProvider();

    let chainId;

    try {
      chainId = await provider?.request({ method: 'eth_chainId' })
        .then(parseHex);
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version');
    }

    return chainId as number;
  }

  public async getAccount (): Promise<null | string> {
    const provider = await this.getProvider();

    let account;

    try {
      account = await provider?.request({ method: 'eth_accounts' })
        .then((result) => (result as string[])[0]);
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable');
    }

    if (!account) {
      try {
        account = await provider?.request({ method: 'eth_requestAccounts' })
          .then((result) => (result as string[])[0]);
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2');
      }
    }

    return account as string;
  }

  public deactivate () {
    this.getProvider().then((provider) => {
      if (provider && provider.off) {
        provider.off('chainChanged', this.handleChainChanged);
        provider.off('accountsChanged', this.handleAccountsChanged);
        provider.off('error', this.handleClose);
        provider.off('close', this.handleClose);
      }
    }).catch(console.error);
  }

  public async isAuthorized (): Promise<boolean> {
    try {
      const provider = await this.getProvider();
      let isAuthorized = false;

      await Promise.race([
        provider?.request({ method: 'eth_accounts' })
          .then((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (parseRequest(result).length > 0) {
              isAuthorized = true;
            } else {
              isAuthorized = false;
            }
          }),
        new Promise<void>((resolve) => {
          // Timeout used to quick fix error of SubWallet v0.4.6 only
          setTimeout(() => {
            isAuthorized = false;

            resolve();
          }, 1000);
        })
      ]);

      return isAuthorized;
    } catch (e) {
      return false;
    }
  }
}
