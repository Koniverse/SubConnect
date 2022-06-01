// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetaMaskInpageProvider } from '@metamask/providers';
import { EvmWallet, EvmWalletInfo, WalletLogoProps } from '@subwallet/wallet-connect/types';

export class BaseEvmWallet implements EvmWallet {
  extensionName = '';
  installUrl = '';
  logo: WalletLogoProps;
  title: string;
  isSetGlobalString: string;
  initEvent: string;

  _extension: MetaMaskInpageProvider | undefined;

  constructor ({ extensionName, initEvent, installUrl, isSetGlobalString, logo, title }: EvmWalletInfo) {
    this.extensionName = extensionName;
    this.logo = logo;
    this.title = title;
    this.installUrl = installUrl;
    this.isSetGlobalString = isSetGlobalString;
    this.initEvent = initEvent;
  }

  private lookupExtension () {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return ((window && window[this.extensionName]) || (window?.ethereum && window?.ethereum[this.isSetGlobalString])) as MetaMaskInpageProvider;
  }

  get extension () {
    if (!this._extension) {
      this._extension = this.lookupExtension();
    }

    return this._extension;
  }

  get installed () {
    return !!this.extension;
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
