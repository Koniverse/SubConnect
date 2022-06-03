// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This file is get idea from https://github.com/TalismanSociety/talisman-connect/blob/master/libs/wallets/src/lib/base-dotsama-wallet/index.ts

import { SubscriptionFn, Wallet, WalletAccount, WalletInfo, WalletLogoProps } from '@subwallet/wallet-connect/types';

import { InjectedAccount, InjectedExtension, InjectedMetadata, InjectedProvider, InjectedWindow } from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';

const DAPP_NAME = 'SubWallet Connect';

export class BaseDotSamaWallet implements Wallet {
  extensionName: string;
  title: string;
  installUrl: string;
  logo: WalletLogoProps;

  _extension: InjectedExtension | undefined;
  _signer: Signer | undefined;
  _metadata: InjectedMetadata | undefined;
  _provider: InjectedProvider | undefined;

  constructor ({ extensionName, installUrl, logo, title }: WalletInfo) {
    this.extensionName = extensionName;
    this.title = title;
    this.installUrl = installUrl;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.logo = logo;

    return this;
  }

  // API docs: https://polkadot.js.org/docs/extension/
  get extension () {
    return this._extension;
  }

  // API docs: https://polkadot.js.org/docs/extension/
  get signer () {
    return this._signer;
  }

  get metadata () {
    return this._metadata;
  }

  get provider () {
    return this._provider;
  }

  get installed () {
    const injectedWindow = window as Window & InjectedWindow;
    const injectedExtension =
      injectedWindow?.injectedWeb3?.[this.extensionName];

    return !!injectedExtension;
  }

  get rawExtension () {
    const injectedWindow = window as Window & InjectedWindow;

    return injectedWindow?.injectedWeb3?.[this.extensionName];
  }

  enable = async () => {
    if (!this.installed) {
      return;
    }

    try {
      const injectedExtension = this.rawExtension;
      const rawExtension = await injectedExtension?.enable(DAPP_NAME);

      if (!rawExtension) {
        return;
      }

      const extension: InjectedExtension = {
        ...rawExtension,
        // Manually add `InjectedExtensionInfo` so as to have a consistent response.
        name: this.extensionName,
        version: injectedExtension.version
      };

      this._extension = extension;
      this._signer = extension?.signer as Signer;
      this._metadata = extension?.metadata;
      this._provider = extension?.provider;
    } catch (err) {
      console.error(err);
    }
  };

  private generateWalletAccount = (account: InjectedAccount): WalletAccount => {
    return {
      ...account,
      source: this._extension?.name as string,
      // Added extra fields here for convenience
      wallet: this,
      signer: this._extension?.signer
    } as WalletAccount;
  };

  subscribeAccounts = async (callback: SubscriptionFn) => {
    if (!this._extension) {
      await this?.enable();
    }

    if (!this._extension) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      callback(undefined);

      return null;
    }

    return this._extension.accounts.subscribe(
      (accounts: InjectedAccount[]) => {
        const accountsWithWallet = accounts.map(this.generateWalletAccount);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        callback(accountsWithWallet);
      }
    );
  };

  getAccounts = async () => {
    if (!this._extension) {
      await this?.enable();
    }

    if (!this._extension) {
      return null;
    }

    const accounts = await this._extension.accounts.get();

    return accounts.map(this.generateWalletAccount);
  };
}
