import { decodeAddress, encodeAddress, ethereumEncode, isAddress, isEthereumAddress } from "@polkadot/util-crypto";


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
