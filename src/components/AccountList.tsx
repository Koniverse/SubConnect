import React, { useContext } from 'react';
import { WalletContext } from '../contexts';
import './AccountList.scss'
import { Button, Divider, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise, WsProvider } from '@polkadot/api';
import artzero_nft from '../lib/contracts/artzero-nft';
import { Signer } from '@polkadot/api/types';
import artzero_rpc from '../lib/contracts/artzero-rpc';

interface Props {
  className?: string;
}

function AccountList ({}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext)

  const signDummy = (address: string) => {
    const signer = walletContext.wallet?.signer;
    if (signer && signer.signRaw) {
      const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
      const key = 'sign-status'
      message.loading({ content: 'Signing', key })
      signPromise.then((rs: any) => {
        message.success({ content: 'Sign Successfully!', key })
      }).catch((error) => {
        message.warn({ content: 'Sign Failed or Cancelled!', key })
      })
    }
  }

  const signContract = async (address: string) => {
    message.info('Connecting to smart contract')
    const signer = walletContext.wallet?.signer;
    if (signer && signer.signRaw && signer.signPayload) {
      // Init contract with static information
      const api = new ApiPromise({ provider: new WsProvider('wss://ws-smartnet.test.azero.dev'), rpc: artzero_rpc });
      await api.isReady;
      const contract = await new ContractPromise(
        api,
        artzero_nft.CONTRACT_ABI,
        artzero_nft.CONTRACT_ADDRESS
      );
      const fee = 10;
      const gasLimit = -1;
      const azero_value = Math.round(fee * (10 ** 12));
      let unsubscribe;

      message.info('Wait for signing')
      contract.tx
        .paidMint({ gasLimit, value: azero_value })
        .signAndSend(
          address,
          // @ts-ignore
          { signer },
          async ({ status, dispatchError }) => {
            if (dispatchError) {
              if (dispatchError.isModule) {
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, method, section } = decoded;
                const errMessage = `${section}.${method}: ${docs.join(' ')}`;
                message.error(errMessage);
              } else {
                console.log(
                  'dispatchError',
                  dispatchError.toString()
                )
              }
            }

            if (status) {
              // @ts-ignore
              const statusText = Object.keys(status.toHuman())[0]
              message.success(
                `Public Minting ${
                  statusText === '0' ? 'started' : statusText.toLowerCase()
                }.`
              )
            }
          }
        )
        .then(unsub => (unsubscribe = unsub))
        .catch(e => {
          message.warn(e.message)
        });
      return unsubscribe;
    }
  }

  return (<div className={'account-list'}>
    {walletContext.accounts.map((acc) => (
      <div className={'account-item'}>
        <div className="info">
          <div className="account-item-info">
            <span className="account-item__title">Name:</span>
            <span className="account-item__content">{acc.name}</span>
          </div>
          <div className="account-item-info">
            <span className="account-item__title">Address:</span>
            <span className="account-item__content">{acc.address}</span>
          </div>
        </div>
        <div className={'actions'}>
          <Button className="sub-wallet-btn sub-wallet-sign-btn" type={'primary'} icon={<EditOutlined/>} onClick={() => {
            signDummy(acc.address)
          }}>
            Sign Dummy
          </Button>
          <Button className="sub-wallet-btn sub-wallet-sign-btn" type={'primary'} icon={<EditOutlined/>} onClick={() => {
            signContract(acc.address)
          }}>
            Sign Contract
          </Button>
        </div>
      </div>
    ))}
  </div>);
}

export default AccountList