import React, { useContext } from 'react';
import AccountList from '../components/AccountList';
import { WalletContext } from '../contexts';
import './WalletInfo.scss';
import WalletMetadata from '../components/WalletMetadata';

interface Props {
  className?: string;
}

function WalletInfo ({}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext)

  return <div className={'boxed-container'}>
    <div className={'wallet-info-page'}>
      <div className='wallet-info-page__text'>Version: {walletContext?.wallet?.extension?.version}</div>
      <div className='wallet-info-page__text'>Account List</div>
      <AccountList/>
      <div className='wallet-info-page__text'>Metadata</div>
      <WalletMetadata/>
    </div>
  </div>
}

export default WalletInfo;