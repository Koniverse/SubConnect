import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts';
import './AccountList.scss'
import { Button, Divider, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';

interface Props {
  className?: string;
}

function AccountList ({}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext)
  const signDummy = (address: string) => {
    const signer = walletContext.wallet?.signer
    if (signer && signer.signRaw) {
      const signPromise = signer.signRaw({ address, data: 'This is dummy message', type: 'bytes' });
      const key = 'sign-status'
      message.loading({content: 'Signing', key})
      signPromise.then((rs: any) => {
        message.success({content: 'Sign Successfully!', key})
      }).catch((error) => {
        message.warn({content: 'Sign Failed or Cancelled!', key})
      })
    }
  }

  return (<div className={'account-list'}>
    {walletContext.accounts.map((acc) => (
      <div className={'account-item'}>
        <div className="info">
          <div><b>Name</b>: {acc.name}</div>
          <div><b>Address</b>: {acc.address}</div>
        </div>
        <div className={'actions'}>
          <Button type={'primary'} icon={<FormOutlined />} onClick={() => {signDummy(acc.address)}}>
            Sign Dummy
          </Button>
        </div>
      </div>
    ))}
  </div>);
}

export default AccountList