import { ChainsMap, NamespaceMetadata } from "@subwallet/wallet-connect/wallet-connect/types";

export const EIP155ChainData: ChainsMap = {
  "eip155:1284": {
    name: "Moonbeam",
    id: "eip155:1284",
    testnet: false,
  },
  "eip155:1285": {
    name: "Moonriver",
    id: "eip155:1285",
    testnet: false,
  },
  "eip155:1287": {
    name: "Moonbase",
    id: "eip155:1287",
    testnet: true,
  },
}

export const EIP155Metadata: NamespaceMetadata = {
  "eip155:1284": {
    name: "Moonbeam",
    logo: '/assets/moonbeam.png',
  },
  "eip155:1285": {
    name: "Moonriver",
    logo: '/assets/moonriver.png',
  },
  "eip155:1287": {
    name: "Moonbase",
    logo: '/assets/moonbase.png',
  },
}

export const PolkadotChainData: ChainsMap = {
  ["polkadot:91b171bb158e2d3848fa23a9f1c25182"]: {
    id: "polkadot:91b171bb158e2d3848fa23a9f1c25182",
    name: "Polkadot",
    testnet: false,
  },
  ["polkadot:e143f23803ac50e8f6f8e62695d1ce9e"]: {
    id: "polkadot:e143f23803ac50e8f6f8e62695d1ce9e",
    name: "Westend",
    testnet: true,
  },
}

export const PolkadotMetadata: NamespaceMetadata = {
  ["polkadot:91b171bb158e2d3848fa23a9f1c25182"]: {
    name: "Polkadot",
    logo: "/assets/polkadot.png",
  },
  ["polkadot:e143f23803ac50e8f6f8e62695d1ce9e"]: {
    name: "Westend",
    logo: "/assets/westend.png",
  },
};

export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = "eth_sendTransaction",
  ETH_SIGN_TRANSACTION = "eth_signTransaction",
  ETH_SIGN = "eth_sign",
  PERSONAL_SIGN = "personal_sign",
  ETH_SIGN_TYPED_DATA = "eth_signTypedData",
}

export enum DEFAULT_EIP_155_EVENTS {
  ETH_CHAIN_CHANGED = "chainChanged",
  ETH_ACCOUNTS_CHANGED = "accountsChanged",
}

export enum DEFAULT_POLKADOT_METHODS {
  POLKADOT_SIGN_TRANSACTION = "polkadot_signTransaction",
  POLKADOT_SIGN_MESSAGE = "polkadot_signMessage",
}

export enum DEFAULT_POLKADOT_EVENTS {}

export const WALLET_CONNECT_PROJECT_ID = '274dcf5a96154928fe72c0e792c0e954'
