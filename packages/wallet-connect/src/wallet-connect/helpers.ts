import { decodeAddress, encodeAddress, ethereumEncode, isAddress, isEthereumAddress } from "@polkadot/util-crypto";
import {
  DEFAULT_EIP155_METHODS,
  DEFAULT_EIP_155_EVENTS,
  DEFAULT_POLKADOT_EVENTS,
  DEFAULT_POLKADOT_METHODS
} from "@subwallet/wallet-connect/wallet-connect/constants";
import { ChainRequestRender, JsonRpcRequest } from "@subwallet/wallet-connect/wallet-connect/types";
import * as encoding from "@walletconnect/encoding";
import { ProposalTypes } from "@walletconnect/types";

export function convertHexToNumber(hex: string) {
  try {
    return encoding.hexToNumber(hex);
  } catch (e) {
    return hex;
  }
}

export function convertHexToUtf8(hex: string) {
  try {
    return encoding.hexToUtf8(hex);
  } catch (e) {
    return hex;
  }
}


export function getChainRequestRender(
  request: JsonRpcRequest
): ChainRequestRender[] {
  let params = [{ label: "Method", value: request.method }];

  switch (request.method) {
    case "eth_sendTransaction":
    case "eth_signTransaction":
      params = [
        ...params,
        { label: "From", value: request.params[0].from },
        { label: "To", value: request.params[0].to },
        {
          label: "Gas Limit",
          value: request.params[0].gas
            ? convertHexToNumber(request.params[0].gas)
            : request.params[0].gasLimit
              ? convertHexToNumber(request.params[0].gasLimit)
              : "",
        },
        {
          label: "Gas Price",
          value: convertHexToNumber(request.params[0].gasPrice),
        },
        {
          label: "Nonce",
          value: convertHexToNumber(request.params[0].nonce),
        },
        {
          label: "Value",
          value: request.params[0].value
            ? convertHexToNumber(request.params[0].value)
            : "",
        },
        { label: "Data", value: request.params[0].data },
      ];
      break;

    case "eth_sign":
      params = [
        ...params,
        { label: "Address", value: request.params[0] },
        { label: "Message", value: request.params[1] },
      ];
      break;
    case "personal_sign":
      params = [
        ...params,
        { label: "Address", value: request.params[1] },
        {
          label: "Message",
          value: convertHexToUtf8(request.params[0]),
        },
      ];
      break;
    default:
      params = [
        ...params,
        {
          label: "params",
          value: JSON.stringify(request.params, null, "\t"),
        },
      ];
      break;
  }
  return params;
}


export function toShort (text: string, preLength = 6, sufLength = 6): string {
  if (!text) {
    return '';
  }

  if (text.length > (preLength + sufLength + 1)) {
    return `${text.slice(0, preLength)}…${text.slice(-sufLength)}`;
  }

  return text;
}

export default function reformatAddress (address: string, networkPrefix = 42, isEthereum = false): string {
  if (!isAddress(address)) {
    return address;
  }

  if (isEthereumAddress(address)) {
    return address;
  }

  try {
    const publicKey = decodeAddress(address);

    if (isEthereum) {
      return ethereumEncode(publicKey);
    }

    if (networkPrefix < 0) {
      return address;
    }

    return encodeAddress(publicKey, networkPrefix);
  } catch {
    return address;
  }
}


export const isSameAddress = (address1: string, address2: string): boolean => {
  const _address1 = reformatAddress(address1);
  const _address2 = reformatAddress(address2);
  return _address1.toLowerCase() === _address2.toLowerCase();
}

export const getNamespacesFromChains = (chains: string[]) => {
  const supportedNamespaces: string[] = [];
  chains.forEach((chainId) => {
    const [namespace] = chainId.split(":");
    if (!supportedNamespaces.includes(namespace)) {
      supportedNamespaces.push(namespace);
    }
  });

  return supportedNamespaces;
};
export const getSupportedEventsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "eip155":
      return Object.values(DEFAULT_EIP_155_EVENTS);
    case "polkadot":
      return Object.values(DEFAULT_POLKADOT_EVENTS);
    default:
      throw new Error(`No default events for namespace: ${namespace}`);
  }
};
export const getSupportedMethodsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "eip155":
      return Object.values(DEFAULT_EIP155_METHODS);
    case "polkadot":
      return Object.values(DEFAULT_POLKADOT_METHODS);
    default:
      throw new Error(`No default methods for namespace: ${namespace}`);
  }
};
export const getRequiredNamespaces = (
  chains: string[]
): ProposalTypes.RequiredNamespaces => {
  const selectedNamespaces = getNamespacesFromChains(chains);
  console.log("selected namespaces:", selectedNamespaces);

  return Object.fromEntries(
    selectedNamespaces.map((namespace) => [
      namespace,
      {
        methods: getSupportedMethodsByNamespace(namespace),
        chains: chains.filter((chain) => chain.startsWith(namespace)),
        events: getSupportedEventsByNamespace(namespace) as any[],
      },
    ])
  );
};
