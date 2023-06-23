// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetaMaskInpageProvider } from '@metamask/providers';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';

import { InjectedExtension, InjectedMetadata, InjectedProvider, Unsubcall } from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/types/types';
import { PairingTypes } from "@walletconnect/types";

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
  wallet?: SubstrateWallet;
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

export interface SubstrateWallet extends WalletInfo, WalletMethods {
  installed: boolean | undefined;

  extension: InjectedExtension | undefined;

  signer: Signer | undefined;

  metadata: InjectedMetadata | undefined;

  provider: InjectedProvider | undefined;
}
export interface EvmWalletMethods {
  request<T>(args: RequestArguments): Promise<Maybe<T>>;
  enable(): Promise<boolean>
}

export interface EvmWalletInfo extends WalletInfo {
  isSetGlobalString: string;
  initEvent?: string
}

export interface EvmWallet extends EvmWalletInfo, EvmWalletMethods {
  installed: boolean;
  extension: MetaMaskInpageProvider | undefined;
  isReady: Promise<MetaMaskInpageProvider | undefined>;
}

export type WalletConnectWalletInfo = Omit<WalletInfo, 'installUrl'>;

export interface WalletConnectRequestArguments {
  request: {
    method: string;
    params: unknown[] | Record<string, unknown>;
  },
  chainId: string;
}

export interface WalletConnectWalletMethods {
  setChains: (chains: string[]) => void;
  connect: (pairing?: any) => Promise<void>;
  disconnect: () => Promise<void>;
  ping: () => Promise<boolean>;
  createRequestHandler: <T>(rpcRequest: (chain: string, address: string) => Promise<T>) => ((chainId: string, address: string) => Promise<T>);
  enable: () => Promise<boolean>;
  sendRequest: <T>(args: WalletConnectRequestArguments) => Promise<T>;
}

export interface WalletConnectWallet extends WalletConnectWalletInfo, WalletConnectWalletMethods {
  installed: boolean;
  isInitializing: boolean;
  isConnected: boolean;
  pairs: PairingTypes.Struct[];
  accounts: string[];
}

// EVM request method callback event params
export interface EvmConnectParams {
  chainId: string;
}

export type Wallet = SubstrateWallet | EvmWallet | WalletConnectWallet;

export type WalletType = 'substrate' | 'evm' | 'wallet_connect'
