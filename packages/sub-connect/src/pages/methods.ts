// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Some code of this file refer to https://github.com/MetaMask/test-dapp/blob/main/src/index.js

import { RequestArguments } from '@metamask/providers/dist/BaseProvider';

export const METHOD_MAP: Record<string, RequestArguments> = {
  addMoonbeamNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x504',
        rpcUrls: ['https://rpc.api.moonbeam.network'],
        chainName: 'Moonbeam',
        nativeCurrency: { name: 'GLMR', decimals: 18, symbol: 'GLMR' },
        blockExplorerUrls: ['https://moonbeam.moonscan.io/']
      }
    ]
  },
  switchToMoonbeamNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x504'
      }
    ]
  },
  addMoonriverNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x505',
        rpcUrls: ['https://rpc.api.moonriver.moonbeam.network'],
        chainName: 'Moonriver',
        nativeCurrency: { name: 'MOVR', decimals: 18, symbol: 'MOVR' },
        blockExplorerUrls: ['https://moonriver.moonscan.io/']
      }
    ]
  },
  switchToMoonriverNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x505'
      }
    ]
  },
  addMoonbaseAlphaNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x507',
        rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
        chainName: 'MoonbaseAlpha',
        nativeCurrency: { name: 'DEV', decimals: 18, symbol: 'DEV' },
        blockExplorerUrls: ['https://moonbase.moonscan.io/']
      }
    ]
  },
  switchToMoonbaseAlphaNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x507'
      }
    ]
  },
  getPermissions: {
    method: 'wallet_getPermissions',
    params: [{ eth_accounts: {} }]
  },
  requestPermissions: {
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }]
  }
};
