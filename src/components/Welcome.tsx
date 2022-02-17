import React, { useContext, useEffect } from 'react';
import { Button } from 'antd';
import './Welcome.scss'
import { OpenSelectWallet, WalletContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

interface Props {
}

function Welcome ({}: Props): React.ReactElement<Props> {
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate()

  useEffect(() => {
    if (walletContext.wallet) {
      navigate('/wallet-info')
    }
  }, [walletContext.wallet])

  return (<div className={'welcome-wrapper'}>
    <div className={'welcome-content'}>
      <h2>Welcome to SubWallet Connect</h2>
      <Button type={'primary'} onClick={selectWallet.open}>Select Wallet</Button>
    </div>
  </div>);
}

export default Welcome