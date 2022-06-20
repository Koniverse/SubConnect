// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Some code of this file refer to https://github.com/MetaMask/test-dapp/blob/main/src/index.js
import { keccak256 } from '@ethersproject/keccak256';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { Maybe } from '@metamask/providers/dist/utils';
import { METHOD_MAP } from '@subwallet/sub-connect/pages/methods';
import { windowReload } from '@subwallet/sub-connect/utils/window';
import { Button, Input, message, Select } from 'antd';
// eslint-disable-next-line camelcase
import { recoverPersonalSignature, recoverTypedSignature, recoverTypedSignature_v4, recoverTypedSignatureLegacy, TypedData, TypedMessage } from 'eth-sig-util';
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
    name: 'ETH Sign',
    method: 'eth_sign',
    getInput: (message: string): string => {
      return keccak256(Buffer.from(message, 'utf8'));
    }
  },
  personalSign: {
    name: 'Personal Sync',
    method: 'personal_sign',
    getInput: (message: string): string => {
      return `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    }
  },
  signTypedData: {
    name: 'Sign Typed Data',
    method: 'eth_signTypedData',
    getInput: (message: string): TypedData => {
      return [{
        type: 'string',
        name: 'Message',
        value: message
      }];
    }
  },
  signTypedDatav3: {
    name: 'Sign Typed Data v3',
    method: 'eth_signTypedData_v3',
    getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
      return {
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' }
          ]
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId,
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        },
        message: {
          from: {
            name: 'John Doe',
            wallet: from
          },
          to: {
            name: 'Alice',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
          },
          contents: message
        }
      };
    }
  },
  signTypedDatav4: {
    name: 'Sign Typed Data v4',
    method: 'eth_signTypedData_v4',
    getInput: (message: string, chainId: number, from: string): TypedMessage<any> => {
      return {
        domain: {
          chainId,
          name: 'Ether Mail',
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          version: '1'
        },
        message: {
          contents: message,
          from: {
            name: 'Cow',
            wallets: [
              from,
              '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
            ]
          },
          to: [
            {
              name: 'Alice',
              wallets: [
                '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                '0xB0B0b0b0b0b0B000000000000000000000000000'
              ]
            }
          ]
        },
        primaryType: 'Mail',
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' }
          ],
          Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' }
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' }
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' }
          ]
        }
      };
    }
  }
};

require('./EvmWalletInfo.scss');

function EvmWalletInfo (): React.ReactElement {
  const wallet = useContext(WalletContext).evmWallet;

  const [accounts, setAccounts] = useState<string[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [network, setNetwork] = useState<NetworkInfo | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(0);
  const [warningNetwork, setWarningNetwork] = useState<string | undefined>(undefined);

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
    function <T> (args: RequestArguments, callback: (rs: Maybe<T>) => void, errorCallback?: (e: Error) => void): void {
      wallet?.request<T>(args)
        .then(callback)
        .catch(async (e: Error) => {
          errorCallback && errorCallback(e);
          await message.error(e.message);
        });
    },
    [wallet]
  );

  const getBalance = useCallback(
    (addresses: string[], network: NetworkInfo) => {
      let total = 0;

      addresses.forEach((address: string) => {
        makeRequest<string>({ method: 'eth_getBalance', params: [address, 'latest'] }, (balance) => {
          if (typeof balance === 'string' && balance.startsWith('0x')) {
            const balVal = network && parseInt(balance, 16);

            if (balVal) {
              total += balVal;
              setBalance(total / (10 ** network.nativeCurrency.decimals));
            }
          }
        });
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

      if (_chainId) {
        const cid = parseInt(_chainId, 16);

        setChainId(cid);
        // eslint-disable-next-line eqeqeq
        const chain = chainList.find((network) => network.chainId == String(cid));

        setNetwork(chain);

        const _accounts = await wallet?.request<string[]>({ method: 'eth_accounts' });

        _accounts && setAccounts(_accounts as string[]);

        if (_accounts && _accounts[0]) {
          getBalance(_accounts as string[], chain as NetworkInfo);

          setInterval(() => {
            getBalance(_accounts as string[], chain as NetworkInfo);
          }, 30000);

          w3?.eth.subscribe('newBlockHeaders')
            .on('connected', function (subscriptionId) {
              console.log('Subscribe network with id ' + subscriptionId);
            })
            .on('data', function (blockHeader) {
              setLastestBlock(blockHeader.number);
            })
            .on('error', console.error);
        }
      } else {
        setWarningNetwork('Please select at least one button below to switch to EVM network');
      }

      wallet?.extension?.on('chainChanged', (chainId) => {
        windowReload();
      });

      wallet?.extension?.on('accountsChanged', () => {
        windowReload();
      });
    };

    init().catch(console.error);
  }
  , [getBalance, makeRequest, wallet]);

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
      makeRequest({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: transactionToAddress,
          value: '0x' + (transactionAmount * (10 ** (network?.nativeCurrency.decimals || 18))).toString(16),
          maxFeePerGas: '0x2540be400',
          maxPriorityFeePerGas: '0x3b9aca00'
        }]
      }, (transactionHash) => {
        if (network?.explorers && network?.explorers.length && transactionHash) {
          const explorer = network?.explorers[0]?.url;

          setTransactionLink(explorer && (explorer + '/tx/' + (transactionHash as string)));
        } else {
          setTransactionLink(undefined);
        }
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
      const args = {} as RequestArguments;

      if (signMethod === 'ethSign') {
        args.method = SIGN_METHODS.ethSign.method;
        args.params = [from, SIGN_METHODS.ethSign.getInput(signMessage)];
      } else if (signMethod === 'personalSign') {
        args.method = SIGN_METHODS.personalSign.method;
        args.params = [SIGN_METHODS.personalSign.getInput(signMessage), from];
      } else if (signMethod === 'signTypedData') {
        args.method = SIGN_METHODS.signTypedData.method;
        args.params = [SIGN_METHODS.signTypedData.getInput(signMessage), from];
      } else if (signMethod === 'signTypedDatav3') {
        args.method = SIGN_METHODS.signTypedDatav3.method;
        args.params = [from, JSON.stringify(SIGN_METHODS.signTypedDatav3.getInput(signMessage, chainId || 0, from))];
      } else if (signMethod === 'signTypedDatav4') {
        args.method = SIGN_METHODS.signTypedDatav4.method;
        args.params = [from, JSON.stringify(SIGN_METHODS.signTypedDatav4.getInput(signMessage, chainId || 0, from))];
      }

      makeRequest<string>(args, (signature) => {
        setSignature(signature as string);
      });
    },
    [accounts, chainId, makeRequest, signMessage, signMethod]
  );

  const verifySignature = useCallback(
    () => {
      const from = accounts[0];
      let recoveredAddress = '';

      if (signMethod === 'ethSign') {
        setSignatureValidation('OK');
      } else if (signMethod === 'personalSign') {
        recoveredAddress = recoverPersonalSignature({
          data: SIGN_METHODS.personalSign.getInput(signMessage),
          sig: signature
        });
      } else if (signMethod === 'signTypedData') {
        recoveredAddress = recoverTypedSignatureLegacy({
          data: SIGN_METHODS.signTypedData.getInput(signMessage),
          sig: signature
        });
      } else if (signMethod === 'signTypedDatav3') {
        recoveredAddress = recoverTypedSignature({
          data: SIGN_METHODS.signTypedDatav3.getInput(signMessage, chainId || 0, from),
          sig: signature
        });
      } else if (signMethod === 'signTypedDatav4') {
        recoveredAddress = recoverTypedSignature_v4({
          data: SIGN_METHODS.signTypedDatav4.getInput(signMessage, chainId || 0, from),
          sig: signature
        });
      }

      setSignatureValidation(recoveredAddress);

      if (recoveredAddress.toLowerCase() === from.toLowerCase()) {
        // eslint-disable-next-line no-void
        void message.success('Verify Success!');
      } else {
        // eslint-disable-next-line no-void
        void message.error('Signed address is different from current address');
      }
    },
    [accounts, chainId, signMessage, signMethod, signature]
  );

  return <div className={'boxed-container'}>
    <div className={'evm-wallet-info-page'}>
      <div className='evm-wallet-info-page__section'>
        <div className='evm-wallet-info-page__text'>Basic Information</div>
        <div>Network: {network && <span className='account-item__content'>{network?.name} ({chainId})</span>}</div>
        <div>Status: <span className='account-item__content'>{(wallet?.extension?.isConnected() && chainId) ? 'Connected' : 'Disconnected'}</span></div>
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
        {warningNetwork && <div className='warning-text'>{warningNetwork}</div>}
        <div className='evm-wallet-info__button_group'>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbeam Network', METHOD_MAP.addMoonbeamNetwork, undefined, chainId === 1284)}
            {generateRequestButton('Switch to Moonbeam', METHOD_MAP.switchToMoonbeamNetwork, undefined, chainId === 1284)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonriver Network', METHOD_MAP.addMoonriverNetwork, undefined, chainId === 1285)}
            {generateRequestButton('Switch to Moonriver', METHOD_MAP.switchToMoonriverNetwork, undefined, chainId === 1285)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Moonbase Network', METHOD_MAP.addMoonbaseAlphaNetwork, undefined, chainId === 1287)}
            {generateRequestButton('Switch to Moonbase', METHOD_MAP.switchToMoonbaseAlphaNetwork, undefined, chainId === 1287)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Astar Network', METHOD_MAP.addAstarNetwork, undefined, chainId === 592)}
            {generateRequestButton('Switch to Astar', METHOD_MAP.switchToAstarNetwork, undefined, chainId === 592)}
          </div>
          <div className='evm-wallet-info__button_row'>
            {generateRequestButton('Add Shiden Network', METHOD_MAP.addShidenNetwork, undefined, chainId === 336)}
            {generateRequestButton('Switch to Shiden', METHOD_MAP.switchToShidenNetwork, undefined, chainId === 336)}
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
            {Object.entries(SIGN_METHODS).map(([k, v]) => (<Option
              key={k}
              value={k}
            >{v.name}</Option>))}
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
