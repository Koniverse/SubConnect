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

  _extension: MetaMaskInpageProvider | undefined;

  constructor ({ extensionName, initEvent, installUrl, isSetGlobalString, logo, title }: EvmWalletInfo) {
    this.extensionName = extensionName;
    this.logo = logo;
    this.title = title;
    this.installUrl = installUrl;
    this.isSetGlobalString = isSetGlobalString;
    this.initEvent = initEvent;

    this.fullLookupProvider()
      .then((extension) => {
        this._extension = extension;
      }).catch(console.log);
  }

  private lookupProvider () {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return ((window && window[this.extensionName]) || (window?.ethereum && window?.ethereum[this.isSetGlobalString])) as MetaMaskInpageProvider;
  }

  private async fullLookupProvider (timeout = 3000): Promise<MetaMaskInpageProvider | undefined> {
    return new Promise((resolve, reject) => {
      let handled = false;
      let currentProvider = this.lookupProvider();
      const initEvent = this.initEvent;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;

      if (currentProvider) {
        resolve(currentProvider);
      } else if (initEvent) {
        window.addEventListener(initEvent, () => {
          currentProvider = this.lookupProvider();
          handleProvider();
        }, { once: true });
        setTimeout(() => {
          handleProvider();
        }, timeout);
      }

      function handleProvider () {
        if (handled) {
          return;
        }

        handled = true;

        // @ts-ignore
        window.removeEventListener(initEvent, handleProvider);

        if (!currentProvider) {
          console.warn(`Not found provider of ${self.title}(${self.extensionName})`);
        }

        resolve(currentProvider);
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

  enable (): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.request<string[]>({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            resolve(true);
          }

          resolve(false);
        }).catch((e) => {
          reject(e);
        });
    });
  }

  request<T> (args: RequestArguments): Promise<Maybe<T>> {
    return this.extension?.request(args);
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
