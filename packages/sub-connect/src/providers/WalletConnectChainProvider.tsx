import { ChainData, ChainMetadata } from "@subwallet/wallet-connect/wallet-connect/types";
import React, { useMemo } from "react";
import {
  EIP155ChainData,
  EIP155Metadata,
  PolkadotChainData,
  PolkadotMetadata
} from "@subwallet/wallet-connect/wallet-connect/constants";

interface WalletConnectChainContextProps {
  chainMap: Record<string, ChainData>;
  chainMetaMap: Record<string, ChainMetadata>;
  chains: Array<ChainData>;
}

export const WalletConnectChainContext = React.createContext<WalletConnectChainContextProps>({
  chainMap: {},
  chainMetaMap: {},
  chains: []
})

interface WalletConnectChainProviderProps {
  children: React.ReactElement;
}

export const WalletConnectChainProvider = ({ children }: WalletConnectChainProviderProps) => {
  const chainMap = useMemo(() => Object.assign({}, EIP155ChainData, PolkadotChainData), []);
  const chainMetaMap = useMemo(() => Object.assign({}, EIP155Metadata, PolkadotMetadata), []);
  const chains = useMemo(() => [...Object.values(EIP155ChainData), ...Object.values(PolkadotChainData)], []);

  return (
    <WalletConnectChainContext.Provider value={{
      chainMap: chainMap,
      chainMetaMap: chainMetaMap,
      chains: chains
    }}>
      {children}
    </WalletConnectChainContext.Provider>
  )
}
