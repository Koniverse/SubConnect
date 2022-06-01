// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet } from '@subwallet/wallet-connect/types';
import React, { useContext } from 'react';

import AccountList from '../components/AccountList';
import WalletMetadata from '../components/WalletMetadata';
import { WalletContext } from '../contexts';

require('./WalletInfo.scss');

function WalletInfo (): React.ReactElement {
  const walletContext = useContext(WalletContext);

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <div className='wallet-info-page__text'>Version: {(walletContext?.wallet as Wallet)?.extension?.version}</div>
      <div className='wallet-info-page__text'>Account List</div>
      <AccountList />
      <div className='wallet-info-page__text'>Metadata</div>
      <WalletMetadata />
    </div>
  </div>;
}

export default WalletInfo;
