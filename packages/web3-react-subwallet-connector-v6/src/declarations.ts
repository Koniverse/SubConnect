// Copyright 2019-2022 @subwallet/web3-react-subwallet-connector-v6 authors & contributors
// SPDX-License-Identifier: Apache-2.0

interface Ethereum {
  request: (args: { method: string, params?: any[] }) => Promise<any>
  isSubWallet: boolean;
  on?: (method: string, listener: (...args: any[]) => void) => void
  off?: (method: string, listener: (...args: any[]) => void) => void
}

declare interface Window {
  SubWallet?: Ethereum
}
