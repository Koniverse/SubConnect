// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InjectedExtension, InjectedMetadata, InjectedProvider, Unsubcall } from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';

export type SubscriptionFn = (
  accounts: WalletAccount[] | undefined
) => void | Promise<void>;

export interface WalletLogoProps {
  src: string;
  alt: string;
}

export interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet?: Wallet;
  signer?: unknown;
}

export interface WalletInfo {
  extensionName: string;
  title: string;
  installUrl: string;
  logo: WalletLogoProps;
}

export interface WalletMethods {
  enable: () => Promise<unknown>;

  subscribeAccounts: (callback: SubscriptionFn) => Promise<Unsubcall | null>;

  getAccounts: () => Promise<WalletAccount[] | null>
}

export interface Wallet extends WalletInfo, WalletMethods {
  installed: boolean | undefined;

  extension: InjectedExtension | undefined;

  signer: Signer | undefined;

  metadata: InjectedMetadata | undefined;

  provider: InjectedProvider | undefined;
}
