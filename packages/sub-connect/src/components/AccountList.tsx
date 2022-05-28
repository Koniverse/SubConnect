/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import { EditOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useCallback, useContext } from 'react';

import { WalletContext } from '../contexts';

require('./AccountList.scss');

function AccountList (): React.ReactElement {
  const walletContext = useContext(WalletContext);

  const signDummy = useCallback(
    (address: string) => {
      const signer = walletContext.wallet?.signer;

      if (signer && signer.signRaw) {
        const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
        const key = 'sign-status';

        message.loading({ content: 'Signing', key });
        signPromise.then((rs: any) => {
          message.success({ content: 'Sign Successfully!', key });
        }).catch((error) => {
          console.error(error);
          message.warn({ content: 'Sign Failed or Cancelled!', key });
        });
      }
    },
    [walletContext.wallet?.signer]
  );

  const onSignClicked = useCallback(
    (address: string) => {
      return () => {
        signDummy(address);
      };
    },
    [signDummy]
  );

  return (<div className={'account-list'}>
    {walletContext.accounts.map((acc) => (
      <div
        className={'account-item'}
        key={acc.address}
      >
        <div className='info'>
          <div className='account-item-info'>
            <span className='account-item__title'>Name:</span>
            <span className='account-item__content'>{acc.name}</span>
          </div>
          <div className='account-item-info'>
            <span className='account-item__title'>Address:</span>
            <span className='account-item__content'>{acc.address}</span>
          </div>
        </div>
        <div className={'actions'}>
          <Button
            className='sub-wallet-btn sub-wallet-sign-btn'
            icon={<EditOutlined />}
            key={acc.address}
            onClick={onSignClicked(acc.address)}
            type={'primary'}
          >
            Sign Dummy
          </Button>
        </div>
      </div>
    ))}
  </div>);
}

export default AccountList;
