// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { METHOD_MAP } from '@subwallet/sub-connect/pages/methods';
import { windowReload } from '@subwallet/sub-connect/utils/window';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import { Button, Input, message } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';

import { WalletContext } from '../contexts';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chainList = require('./evmChains.json') as NetworkInfo[];

interface NetworkInfo {
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
  const [network, setNetwork] = useState<NetworkInfo | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  // @ts-ignore
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);
  const [lastestBlock, setLastestBlock] = useState<number | undefined>(undefined);

  // transaction
  const [transactionToAddress, setTransactionToAddress] = useState('');
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [transactionLink, setTransactionLink] = useState<string | undefined>(undefined);

  const makeRequest = useCallback(
    function <T> (args: RequestArguments, callback: (rs: Maybe<T>) => void): void {
      wallet?.request<T>(args)
        .then(callback)
        .catch(async (e: Error) => {
          await message.error(e.message);
        });
    },
    [wallet]
  );

  const getBalance = useCallback(
    (address: string, network: NetworkInfo) => {
      makeRequest<string>({ method: 'eth_getBalance', params: [address, 'latest'] }, (balance) => {
        if (typeof balance === 'string' && balance.startsWith('0x')) {
          const balVal = network && parseInt(balance, 16) / (10 ** network.nativeCurrency.decimals);

          setBalance(balVal);
        }
      });
    },
    [makeRequest]
  );

  const generateRequestButton = useCallback(
    (label: string, args: RequestArguments, callback?: (rs: Maybe<unknown>) => void) => (<Button
      className='sub-wallet-btn sub-wallet-btn-small-size'
      key={label}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        makeRequest(args, callback || console.log);
      }}
    >
      {label}
    </Button>),
    [makeRequest]
  );

  useEffect(() => {
    const init = async () => {
      if (!wallet) {
        return;
      }

      const w3 = wallet?.extension && new Web3(wallet.extension as AbstractProvider);

      const _chainId = await wallet?.request<string>({ method: 'eth_chainId' });
      const cid = parseInt(_chainId as string, 16);

      setChainId(cid);
      // eslint-disable-next-line eqeqeq
      const chain = chainList.find((network) => network.chainId == String(cid));

      setNetwork(chain);

      const _accounts = await wallet?.request<string[]>({ method: 'eth_accounts' });

      _accounts && setAccounts(_accounts as string[]);

      if (_accounts && _accounts[0]) {
        getBalance(_accounts[0], chain as NetworkInfo);

        w3?.eth.subscribe('newBlockHeaders')
          .on('connected', function (subscriptionId) {
            console.log('Subscribe network with id ' + subscriptionId);
          })
          .on('data', function (blockHeader) {
            setLastestBlock(blockHeader.number);
          })
          .on('error', console.error);
      }

      wallet?.extension?.on('chainChanged', () => {
        windowReload();
      });

      wallet?.extension?.on('accountsChanged', () => {
        windowReload();
      });
    };

    init().catch(console.error);
  }
  , [getBalance, wallet]);

  const _onChangeTransactionToAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransactionToAddress(e.target.value);
    },
    []
  );

  const _onChangeTransactionAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransactionAmount(Number(e.target.value));
    },
    []
  );

  const sendTransaction = useCallback(
    () => {
      console.log(transactionAmount);
      makeRequest({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: transactionToAddress,
          value: (transactionAmount * (10 ** (network?.nativeCurrency.decimals || 18))).toString(16),
          gasLimit: '0x5028',
          maxFeePerGas: '0x2540be400',
          maxPriorityFeePerGas: '0x3b9aca00'
        }]
      }, (transactionHash) => {
        const explorer = network?.explorers[0]?.url;

        setTransactionLink(explorer && (explorer + '/tx/' + (transactionHash as string)));
      });
    },
    [accounts, makeRequest, network?.explorers, network?.nativeCurrency.decimals, transactionAmount, transactionToAddress]
  );

  return <div className={'boxed-container'}>
    <div className={'evm-wallet-info-page'}>
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
          {generateRequestButton('Get Permissions', METHOD_MAP.getPermissions, console.warn)}</div>
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
        <div className='evm-wallet-info-page__text'>Transactions</div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>From Address</span>
          <Input
            className='code'
            readOnly
            type='text'
            value={accounts[0]}
          />
        </div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>To Address</span>
          <Input
            className='code'
            onChange={_onChangeTransactionToAddress}
            type='text'
          />
        </div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>Amount</span>
          <Input
            className='code'
            defaultValue={transactionAmount}
            onChange={_onChangeTransactionAmount}
            type='number'
          />
          <span className='suffix'>{network?.nativeCurrency.symbol}</span>
        </div>
        <div>
          <Button
            className='sub-wallet-btn sub-wallet-btn-small-size transaction-button'
            onClick={sendTransaction}
          >Send transaction</Button>
          {transactionLink && <div>
            Check transaction on block explorer by click
            <a
              href={transactionLink}
              rel='noreferrer'
              target='_blank'
            > here</a>
          </div>}
        </div>
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Connect provider with web3.js</div>
        <div>Latest block: <span className='account-item__content'>{lastestBlock}</span></div>
      </div>
    </div>
  </div>;
}

export default EvmWalletInfo;
