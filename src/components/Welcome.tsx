import React, { useContext, useEffect } from 'react';
import './Welcome.scss'
import { OpenSelectWallet, WalletContext } from '../contexts';
import { useNavigate } from 'react-router-dom';
import {Button} from "antd";


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
      <div className='welcome-content__text'>Welcome to SubWallet Connect</div>
      <Button className='sub-wallet-btn sub-wallet-btn-normal-size' onClick={selectWallet.open}>Select Wallet</Button>
    </div>
  </div>);
}

export default Welcome
