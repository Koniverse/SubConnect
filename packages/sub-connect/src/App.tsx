// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import EvmWalletInfo from '@subwallet/sub-connect/pages/EvmWalletInfo';
import { WalletContextProvider } from '@subwallet/sub-connect/providers/WalletContextProvider';
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Welcome from './components/Welcome';
import WalletInfo from './pages/WalletInfo';

require('./App.scss');

// Add new example wallet
// doAddWallet();

export function App () {
  return (
    <WalletContextProvider>
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
            <Route
              element={<EvmWalletInfo />}
              path='/evm-wallet-info'
            />
          </Route>
        </Routes>
      </HashRouter>
    </WalletContextProvider>
  );
}
