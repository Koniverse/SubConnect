// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { METHOD_MAP } from '@subwallet/sub-connect/pages/methods';
import { windowReload } from '@subwallet/sub-connect/utils/window';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import { Button } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';

import { WalletContext } from '../contexts';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chainList = require('./evmChains.json') as NetworkInfo[];

interface NetworkInfo{
  name: string,
  chain: string,
  rpc: string[],
  faucets: [],
  nativeCurrency: { name: string, 'symbol': string, 'decimals': number },
  infoURL: string,
  shortName: string,
  chainId: string,
  networkId: string,
  explorers: [{ 'name': string, 'url': string, 'standard': string }]
}

require('./EvmWalletInfo.scss');

function EvmWalletInfo (): React.ReactElement {
  const wallet = useContext(WalletContext).wallet as EvmWallet;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [network, setNetwork] = useState<NetworkInfo|undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  // @ts-ignore
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [web3Balance, setWeb3Balance] = useState<number | undefined>(undefined);

  const makeRequest = useCallback(
    function <T> (args: RequestArguments, callback: (rs: Maybe<T>) => void): void {
      wallet?.request<T>(args)
        .then(callback)
        .catch(console.error);
    },
    [wallet]
  );

  const getBalance = useCallback(
    (address: string) => {
      makeRequest<string>({ method: 'eth_getBalance', params: [address, 'latest'] }, (balance) => {
        if (typeof balance === 'string' && balance.startsWith('0x')) {
          const balVal = network && parseInt(balance, 16) / (10 ** network.nativeCurrency.decimals);

          setBalance(balVal);
        }
      });
    },
    [makeRequest, network]
  );

  const generateRequestButton = useCallback(
    (label: string, args: RequestArguments) => (<Button
      className='sub-wallet-btn sub-wallet-btn-small-size'
      key={label}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        makeRequest(args, console.log);
      }}
    >
      {label}
    </Button>),
    [makeRequest]
  );

  useEffect(() => {
    const w3 = wallet?.extension && new Web3(wallet.extension as AbstractProvider);

    setWeb3(w3);

    makeRequest<string>({ method: 'eth_chainId' }, (_chainId) => {
      if (_chainId) {
        const cid = parseInt(_chainId, 16);

        setChainId(cid);
        // eslint-disable-next-line eqeqeq
        const chain = chainList.find((network) => network.chainId == String(cid));

        setNetwork(chain);
      }
    });

    makeRequest<string[]>({ method: 'eth_accounts' }, (_accounts) => {
      _accounts && setAccounts(_accounts as string[]);

      if (_accounts && _accounts[0]) {
        getBalance(_accounts[0]);

        w3?.eth.getNodeInfo().then(console.log).catch(console.error);

        w3?.eth.getBalance(_accounts[0])
          .then((balance) => {
            if (typeof balance === 'string') {
              const balVal = parseInt(balance, 10) / (10 ** 18);

              setWeb3Balance(balVal);
            }
          })
          .catch(console.error);
      }
    });

    wallet?.extension?.on('chainChanged', () => {
      windowReload();
    });

    wallet?.extension?.on('accountsChanged', () => {
      windowReload();
    });
  }, [getBalance, makeRequest, wallet, wallet?.extension]);

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Basic Information</div>
        <div>Network: <span className='account-item__content'>{network?.name} ({chainId})</span></div>
        <div>Status: <span className='account-item__content'>{wallet?.extension?.isConnected() ? 'Connected' : 'Disconnected'}</span></div>
        <div>Current Address: <span className='account-item__content'>{accounts.join(', ')}</span></div>
        <div>Balance: <span className='account-item__content'>{balance} {network?.nativeCurrency.symbol}</span></div>
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Permissions</div>
        <div className='evm-wallet-info__button_group'>
          {generateRequestButton('Request Permissions', METHOD_MAP.requestPermissions)}
          {generateRequestButton('Get Permissions', METHOD_MAP.getPermissions)}</div>
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Network Actions</div>
        <div className='evm-wallet-info__button_group'>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbeam Network', METHOD_MAP.addMoonbeamNetwork)}
            {generateRequestButton('Switch to Moonbeam', METHOD_MAP.switchToMoonbeamNetwork)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonriver Network', METHOD_MAP.addMoonriverNetwork)}
            {generateRequestButton('Switch to Moonriver', METHOD_MAP.switchToMoonriverNetwork)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbase Network', METHOD_MAP.addMoonbaseAlphaNetwork)}
            {generateRequestButton('Switch to Moonbase', METHOD_MAP.switchToMoonbaseAlphaNetwork)}
          </div>
        </div>
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Connect provider with web3.js</div>
        <div>Balance: <span className='account-item__content'>{web3Balance} {network?.nativeCurrency.symbol}</span></div>
      </div>
    </div>
  </div>;
}

export default EvmWalletInfo;
