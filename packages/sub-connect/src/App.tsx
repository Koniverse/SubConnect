// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { doAddWallet } from '@subwallet/sub-connect/new-wallet-example/newWalletExample';
import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import { Wallet, WalletAccount } from '@subwallet/wallet-connect/types';
import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Welcome from './components/Welcome';
import { useLocalStorage } from './hooks/useLocalStorage/useLocalStorage';
import WalletInfo from './pages/WalletInfo';
import { OpenSelectWallet, WalletContext } from './contexts';

require('./App.scss');

// Add new example wallet
doAddWallet();

export function App () {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [currentWallet, setCurrentWallet] = useState<Wallet | undefined>(getWalletBySource(walletKey));
  const [isSelectWallet, setIsSelectWallet] = useState(false);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  let subWalletTheme = window.localStorage.getItem('sub-wallet-theme');

  if (!subWalletTheme) {
    window.localStorage.setItem('sub-wallet-theme', 'dark');
    subWalletTheme = 'dark';
  }

  document.body.style.backgroundColor = subWalletTheme === 'dark' ? '#020412' : '#FFF';

  const selectWallet = async (wallet: Wallet) => {
    setCurrentWallet(currentWallet);

    if (wallet?.installed) {
      await wallet.enable();
      setWalletKey(wallet.extensionName);

      const infos = await wallet.getAccounts();

      infos && setAccounts(infos);
    }
  };

  const walletContext = {
    wallet: getWalletBySource(walletKey),
    accounts,
    setWallet: (wallet: Wallet | undefined) => {
      wallet && selectWallet(wallet);
    }
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
      const wallet = getWalletBySource(walletKey);

      if (wallet) {
        const fetchInfo = () => {
          wallet.getAccounts().then((infos) => {
            infos && setAccounts(infos);
          }).catch(console.error);
        };

        setTimeout(fetchInfo, 150);
      }
    },
    [walletKey]
  );

  return (
    <WalletContext.Provider value={walletContext}>
      <OpenSelectWallet.Provider value={selectWalletContext}>
        <HashRouter>
          <Routes>
            <Route
              element={<Layout />}
              path='/'
            >
              <Route
                element={<Welcome />}
                index
              />
              <Route
                element={<Welcome />}
                path='/welcome'
              />
              <Route
                element={<WalletInfo />}
                path='/wallet-info'
              />
            </Route>
          </Routes>
        </HashRouter>
      </OpenSelectWallet.Provider>
    </WalletContext.Provider>
  );
}
