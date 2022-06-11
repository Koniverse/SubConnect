// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetaMaskInpageProvider } from '@metamask/providers';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/types';
import { EvmWallet, EvmWalletInfo, WalletLogoProps } from '@subwallet/wallet-connect/types';

export class BaseEvmWallet implements EvmWallet {
  extensionName = '';
  installUrl = '';
  logo: WalletLogoProps;
  title: string;
  isSetGlobalString: string;
  initEvent?: string;
  _isReady = false;
  _handledReady = false;
  isReady: Promise<MetaMaskInpageProvider | undefined>;

  _extension: MetaMaskInpageProvider | undefined;

  constructor ({ extensionName, initEvent, installUrl, isSetGlobalString, logo, title }: EvmWalletInfo) {
    this.extensionName = extensionName;
    this.logo = logo;
    this.title = title;
    this.installUrl = installUrl;
    this.isSetGlobalString = isSetGlobalString;
    this.initEvent = initEvent;
    this.isReady = this.waitReady()
      .then((extension) => {
        this._extension = extension;
        this._isReady = true;

        return extension;
      });
  }

  private lookupProvider () {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return ((window && window[this.extensionName]) || (window?.ethereum && window?.ethereum[this.isSetGlobalString])) as MetaMaskInpageProvider;
  }

  private async waitReady (timeout = 3000): Promise<MetaMaskInpageProvider | undefined> {
    if (this._isReady) {
      return Promise.resolve(this.extension);
    }

    return new Promise((resolve) => {
      let currentProvider = this.lookupProvider();
      const initEvent = this.initEvent;

      if (currentProvider) {
        this._handledReady = true;
        resolve(currentProvider);
      } else if (initEvent) {
        const handleProvider = () => {
          if (this._handledReady) {
            return;
          }

          this._handledReady = true;

          window.removeEventListener(initEvent, handleProvider);

          currentProvider = this.lookupProvider();

          if (!currentProvider) {
            console.warn(`Not found provider of ${this.title}(${this.extensionName})`);
          }

          resolve(currentProvider);
        };

        window.addEventListener(initEvent, handleProvider, { once: true });
        setTimeout(() => {
          handleProvider();
        }, timeout);
      }
    });
  }

  get extension () {
    if (!this._extension) {
      this._extension = this.lookupProvider();
    }

    return this._extension;
  }

  get installed () {
    return !!this.extension;
  }

  async enable (): Promise<boolean> {
    await this.isReady;
    const accounts = await this.request<string[]>({ method: 'eth_requestAccounts' });

    return !!(accounts && accounts.length > 0);
  }

  async request<T> (args: RequestArguments): Promise<Maybe<T>> {
    await this.isReady;

    return await this.extension.request<T>(args);
  }

  // addProvider (provider: any): void {
  // }
  //
  // on (event: string, handler: () => void): void {
  // }
  //
  // send (payload: JSONRPCRequestPayload): void {
  // }
  //
  // sendAsync (payload: JSONRPCRequestPayload, callback: (error: (Error | null), response: JSONRPCResponsePayload) => void): void;
  // sendAsync (payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
  // sendAsync (payload: JSONRPCRequestPayload, callback: ((error: (Error | null), response: JSONRPCResponsePayload) => void) | JSONRPCErrorCallback): void {
  // }
  //
  // start (callback?: () => void): void {
  // }
  //
  // stop (): void {
  // }
}
