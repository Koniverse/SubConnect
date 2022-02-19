import React, { useContext } from 'react';
import { WalletContext } from '../contexts';
import './AccountList.scss'
import { Button, Divider, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

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
          <Button className='sub-wallet-btn sub-wallet-sign-btn' type={'primary'} icon={<EditOutlined />} onClick={() => {signDummy(acc.address)}}>
            Sign Dummy
          </Button>
        </div>
      </div>
    ))}
  </div>);
}

export default AccountList