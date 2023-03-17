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
  addAstarNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x250',
        rpcUrls: ['https://astar.public.blastapi.io'],
        chainName: 'Astar',
        nativeCurrency: { name: 'ASTR', decimals: 18, symbol: 'ASTR' },
        blockExplorerUrls: ['https://blockscout.com/astar']
      }
    ]
  },
  switchToAstarNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x250' // 592
      }
    ]
  },
  addShidenNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x150', // 336
        rpcUrls: ['https://shiden.public.blastapi.io'],
        chainName: 'Shiden',
        nativeCurrency: { name: 'SDN', decimals: 18, symbol: 'SDN' },
        blockExplorerUrls: ['https://blockscout.com/astar']
      }
    ]
  },
  switchToShidenNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x150'
      }
    ]
  },
  addShibuyaNetwork: {
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x51',
        rpcUrls: ['https://evm.shibuya.astar.network'],
        chainName: 'Shibuya Testnet',
        nativeCurrency: { name: 'SBY', decimals: 18, symbol: 'SBY' },
        blockExplorerUrls: ['https://blockscout.com/shibuya']
      }
    ]
  },
  switchToShibuyaNetwork: {
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: '0x51' // 81
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
