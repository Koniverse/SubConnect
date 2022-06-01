// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { windowReload } from '@subwallet/sub-connect/utils/window';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { WalletContext } from '../contexts';

require('./WalletInfo.scss');

function EvmWalletInfo (): React.ReactElement {
  const wallet = useContext(WalletContext).wallet as EvmWallet;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const getBalance = useCallback(
    (address: string) => {
      wallet?.extension?.request({ method: 'eth_getBalance', params: [address, 'latest'] })
        .then((balance) => {
          if (typeof balance === 'string' && balance.startsWith('0x')) {
            const balVal = parseInt(balance, 16) / (10 ** 18);

            setBalance(balVal);
          }
        })
        .catch(console.error);
    },
    [wallet?.extension]
  );

  useEffect(() => {
    wallet?.extension?.request<string>({ method: 'eth_chainId' }).then((_chainId) => {
      _chainId && setChainId(_chainId);
    }).catch(console.error);

    wallet?.extension?.request<string[]>({ method: 'eth_accounts' }).then((_accounts) => {
      _accounts && setAccounts(_accounts as string[]);

      if (_accounts && _accounts[0]) {
        getBalance(_accounts[0]);
      }
    }).catch(console.error);

    wallet?.extension?.on('chainChanged', (chainId) => {
      windowReload();
    });

    wallet?.extension?.on('accountsChanged', (account) => {
      windowReload();
    });
  }, [getBalance, wallet?.extension]);

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <div className='wallet-info-page__text'>Chain ID: {chainId}</div>
      <div className='wallet-info-page__text'>Addresses: <span className='account-item__content'>{accounts.join(', ')}</span></div>
      <div className='wallet-info-page__text'>Balance: {balance}</div>
    </div>
  </div>;
}

export default EvmWalletInfo;
