import React, { useContext } from 'react';
import AccountList from '../components/AccountList';
import { WalletContext } from '../contexts';
import './WalletInfo.scss';
import { Button } from 'antd';

interface Props {
  className?: string;
}

function WalletInfo ({}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext)

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <h3>Version: {walletContext?.wallet?.extension?.version}</h3>
      <h3>Account List</h3>
      <AccountList/>
    </div>
  </div>
}

export default WalletInfo;