// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLocalStorage } from '@subwallet/sub-connect/hooks/useLocalStorage';
import { windowReload } from '@subwallet/sub-connect/utils/window';
import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import { getEvmWalletBySource } from '@subwallet/wallet-connect/evm/evmWallets';
import {
  EvmWallet,
  SubstrateWallet,
  Wallet,
  WalletAccount, WalletConnectWallet,
  WalletType
} from '@subwallet/wallet-connect/types';
import React, { useCallback, useEffect, useState } from 'react';

import { OpenSelectWallet, WalletContext, WalletContextInterface } from '../contexts';
import { getWalletConnectWalletBySource } from "@subwallet/wallet-connect/wallet-connect/walletConnectWallets";

interface Props {
  children: React.ReactElement;
}

export function WalletContextProvider ({ children }: Props) {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [walletType, setWalletType] = useLocalStorage('wallet-type', 'substrate');
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(getWalletBySource(walletKey));
  const [isSelectWallet, setIsSelectWallet] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);

  const afterSelectWallet = useCallback(
    async (wallet: SubstrateWallet) => {
      const infos = await wallet.getAccounts();

      infos && setAccounts(infos);
    },
    []
  );

  const selectSubstrateWallet = useCallback(
    async (wallet: SubstrateWallet) => {
      setCurrentWallet(currentWallet);

      await wallet.enable();
      setWalletKey(wallet.extensionName);

      await afterSelectWallet(wallet);
    },
    [afterSelectWallet, currentWallet, setWalletKey]
  );

  const afterSelectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await wallet?.enable(); // Quick call extension?.request({ method: 'eth_requestAccounts' });
    },
    []
  );

  const selectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await afterSelectEvmWallet(wallet);

      setCurrentWallet(currentWallet);

      setWalletKey(wallet.extensionName);

      windowReload();
    },
    [afterSelectEvmWallet, currentWallet, setWalletKey]
  );

  const selectWalletConnect = useCallback(
    async (wallet: WalletConnectWallet) => {
      setCurrentWallet(currentWallet);
      setWalletKey(wallet.extensionName);
    },
    [afterSelectWallet, currentWallet, setWalletKey]
  );

  const walletContext = {
    wallet: getWalletBySource(walletKey),
    evmWallet: getEvmWalletBySource(walletKey),
    walletConnectWallet: getWalletConnectWalletBySource(walletKey),
    accounts,
    setWallet: (wallet: Wallet, walletType: WalletType) => {
      switch (walletType) {
        case "substrate":
          wallet && selectSubstrateWallet(wallet as SubstrateWallet);
          break;
        case "evm":
          wallet && selectEvmWallet(wallet as EvmWallet);
          break;
        case "wallet_connect":
          wallet && selectWalletConnect(wallet as WalletConnectWallet);
          break;
      }

      wallet && setWalletType(walletType);
    },
    walletType
  };

  const selectWalletContext = {
    isOpen: isSelectWallet,
    open: () => {
      setIsSelectWallet(true);
    },
    close: () => {
      setIsSelectWallet(false);
    }
  };

  useEffect(
    () => {
      const _walletType = walletType as WalletType;
      switch (_walletType) {
        case 'substrate': {
          const wallet = getWalletBySource(walletKey);

          setTimeout(() => {
            if (wallet && wallet?.installed) {
              // eslint-disable-next-line no-void
              void afterSelectWallet(wallet);
            }
          }, 150);
          break;
        }
        case "evm": {
          const wallet = getEvmWalletBySource(walletKey);

          wallet && wallet?.isReady.then(() => {
            afterSelectEvmWallet(wallet).catch(console.error);
          });
          break;
        }
      }
    },
    [afterSelectEvmWallet, afterSelectWallet, walletKey, walletType]
  );

  return <WalletContext.Provider value={walletContext as WalletContextInterface}>
    <OpenSelectWallet.Provider value={selectWalletContext}>
      {children}
    </OpenSelectWallet.Provider>
  </WalletContext.Provider>;
}
