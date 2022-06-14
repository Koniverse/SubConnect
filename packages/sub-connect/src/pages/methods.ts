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
  addBinanceNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x38',
        rpcUrls: ['https://bsc-dataseed1.binance.org', 'https://bsc-dataseed2.binance.org', 'https://bsc-dataseed3.binance.org', 'https://bsc-dataseed4.binance.org', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed2.defibit.io', 'https://bsc-dataseed3.defibit.io', 'https://bsc-dataseed4.defibit.io', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed2.ninicoin.io', 'https://bsc-dataseed3.ninicoin.io', 'https://bsc-dataseed4.ninicoin.io', 'wss://bsc-ws-node.nariox.org'],
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
        blockExplorerUrls: ['https://bscscan.com']
      }
    ]
  },
  switchToBinanceNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x38'
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
