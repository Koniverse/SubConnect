// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Some code of this file refer to https://github.com/MetaMask/test-dapp/blob/main/src/index.js
import { keccak256 } from '@ethersproject/keccak256';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { METHOD_MAP } from '@subwallet/sub-connect/pages/methods';
import { windowReload } from '@subwallet/sub-connect/utils/window';
import { Button, Input, message, Select } from 'antd';
import { recoverPersonalSignature, recoverTypedSignatureLegacy } from 'eth-sig-util';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';

import { WalletContext } from '../contexts';

const { Option } = Select;

// Json file is download from https://chainid.network/chains.json
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

const SIGN_METHODS = {
  ethSign: {
    name: 'ETH Sign'
  },
  personalSign: {
    name: 'Personal Sync'
  },
  signTypedData: {
    name: 'Sign Typed Data'
  }
};

require('./EvmWalletInfo.scss');

function EvmWalletInfo (): React.ReactElement {
  const wallet = useContext(WalletContext).evmWallet;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [network, setNetwork] = useState<NetworkInfo | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const [lastestBlock, setLastestBlock] = useState<number | undefined>(undefined);

  // transaction
  const [transactionToAddress, setTransactionToAddress] = useState('');
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [transactionLink, setTransactionLink] = useState<string | undefined>(undefined);

  // signature
  const [signMessage, setSignMessage] = useState('Hello Alice!');
  const [signature, setSignature] = useState('');
  const [signMethod, setSignMethod] = useState('personalSign');
  const [signatureValidation, setSignatureValidation] = useState('');

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
    (label: string, args: RequestArguments, callback?: (rs: Maybe<unknown>) => void, disabled?: boolean) => (<Button
      className='sub-wallet-btn sub-wallet-btn-small-size'
      disabled={disabled}
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

      await wallet.isReady;

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

  const _onChangeSignMessage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignMessage(e.target.value);
      setSignature('');
      setSignatureValidation('');
    },
    []
  );

  const _onChangeSignMethod = useCallback(
    (value: string) => {
      setSignMethod(value);
      setSignature('');
      setSignatureValidation('');
    },
    []
  );

  const handlePermissionsRs = useCallback(
    (response: Maybe<unknown>) => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accounts = response[0]?.caveats[0].value as string[] || [];

      setAvailableAccounts(accounts);
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

  const signData = useCallback(
    () => {
      // @ts-ignore
      if (!SIGN_METHODS[signMethod]) {
        return;
      }

      const from = accounts[0];
      let message = signMessage;
      const args = {} as RequestArguments;

      if (signMethod === 'ethSign') {
        message = keccak256(Buffer.from(signMessage, 'utf8'));
        args.method = 'eth_sign';
        args.params = [from, message];
      } else if (signMethod === 'personalSign') {
        message = `0x${Buffer.from(signMessage, 'utf8').toString('hex')}`;
        args.method = 'personal_sign';
        args.params = [message, from, 'Example password'];
      } else if (signMethod === 'signTypedData') {
        args.method = 'eth_signTypedData';
        args.params = [
          [{
            type: 'string',
            name: 'Message',
            value: message
          }],
          from
        ];
      }

      makeRequest<string>(args, (signature) => {
        setSignature(signature as string);
      });
    },
    [accounts, makeRequest, signMessage, signMethod]
  );

  const verifySignature = useCallback(
    () => {
      const from = accounts[0];
      let recoveredAddress = '';
      let mess = signMessage;

      if (signMethod === 'ethSign') {
        setSignatureValidation('OK');
      } else if (signMethod === 'personalSign') {
        mess = `0x${Buffer.from(signMessage, 'utf8').toString('hex')}`;
        recoveredAddress = recoverPersonalSignature({
          data: mess,
          sig: signature
        });
      } else if (signMethod === 'signTypedData') {
        recoveredAddress = recoverTypedSignatureLegacy({
          data: [{
            type: 'string',
            name: 'Message',
            value: mess
          }],
          sig: signature
        });
      }

      setSignatureValidation(recoveredAddress);

      if (recoveredAddress === from) {
        // eslint-disable-next-line no-void
        void message.success('Verify Success!');
      } else {
        // eslint-disable-next-line no-void
        void message.error('Signed address is different from current address');
      }
    },
    [accounts, signMessage, signMethod, signature]
  );

  return <div className={'boxed-container'}>
    <div className={'evm-wallet-info-page'}>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Basic Information</div>
        <div>Network: <span className='account-item__content'>{network?.name} ({chainId})</span></div>
        <div>Status: <span className='account-item__content'>{wallet?.extension?.isConnected() ? 'Connected' : 'Disconnected'}</span></div>
        <div>Current Address: <span className='account-item__content font-mono'>{accounts.join(', ')}</span></div>
        <div>Balance: <span className='account-item__content'>{balance} {network?.nativeCurrency.symbol}</span></div>
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Permissions</div>
        <div className='evm-wallet-info__button_group'>
          {generateRequestButton('Get Permissions', METHOD_MAP.getPermissions, handlePermissionsRs)}
          {generateRequestButton('Request Permissions', METHOD_MAP.requestPermissions, handlePermissionsRs)}
        </div>
        {availableAccounts.length > 0 && (
          <div>
            <div>Available Accounts:</div>
            <div><span className='account-item__content font-mono'>{availableAccounts.join('\n')}</span></div>
          </div>
        )}
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Network Actions</div>
        <div className='evm-wallet-info__button_group'>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbeam Network', METHOD_MAP.addMoonbeamNetwork, console.log, chainId === 1284)}
            {generateRequestButton('Switch to Moonbeam', METHOD_MAP.switchToMoonbeamNetwork, console.log, chainId === 1284)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonriver Network', METHOD_MAP.addMoonriverNetwork, console.log, chainId === 1285)}
            {generateRequestButton('Switch to Moonriver', METHOD_MAP.switchToMoonriverNetwork, console.log, chainId === 1285)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbase Network', METHOD_MAP.addMoonbaseAlphaNetwork, console.log, chainId === 1287)}
            {generateRequestButton('Switch to Moonbase', METHOD_MAP.switchToMoonbaseAlphaNetwork, console.log, chainId === 1287)}
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
        <div className='evm-wallet-info-page__text'>Signature</div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>Message</span>
          <Input
            className='code'
            defaultValue={signMessage}
            onChange={_onChangeSignMessage}
            type='text'
          />
        </div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>Sign Method</span>
          <Select
            defaultValue={signMethod}
            onChange={_onChangeSignMethod}
          >
            <Option value='ethSign'>ETH Sign</Option>
            <Option value='personalSign'>Personal Sign</Option>
            <Option value='signTypedData'>Sign Typed Data</Option>
          </Select>
        </div>
        <div className='evm-wallet-transaction_row'>
          <Button
            className='sub-wallet-btn sub-wallet-btn-small-size max-w'
            onClick={signData}
          >Sign Data</Button>
        </div>
        <div className='evm-wallet-transaction_row'>
          <span className='label'>Result</span>
          <Input
            className='code'
            readOnly={true}
            type='text'
            value={signature}
          />
        </div>
        {signMethod !== 'ethSign' && <div>
          <div className='evm-wallet-transaction_row'>
            <Button
              className='sub-wallet-btn sub-wallet-btn-small-size max-w'
              disabled={signature === ''}
              onClick={verifySignature}
            >Verify Signature</Button>
          </div>
          <div className='evm-wallet-transaction_row'>
            <span className='label'>Validate Result</span>
            <Input
              className='code'
              readOnly={true}
              type='text'
              value={signatureValidation}
            />
          </div>
        </div>}
      </div>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Connect provider with web3.js</div>
        <div>Latest block: <span className='account-item__content'>{lastestBlock}</span></div>
      </div>
    </div>
  </div>;
}

export default EvmWalletInfo;
