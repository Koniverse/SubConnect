// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenSelectWallet, WalletContext } from '../contexts';

require('./Welcome.scss');

function Welcome (): React.ReactElement {
  const selectWallet = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletContext.wallet) {
      navigate('/wallet-info');
    }
  }, [navigate, walletContext.wallet]);

  return (<div className={'welcome-wrapper'}>
    <div className={'welcome-content'}>
      <div className='welcome-content__text'>Welcome to SubWallet Connect</div>
      <Button
        className='sub-wallet-btn sub-wallet-btn-normal-size'
        onClick={selectWallet.open}
      >Select Wallet</Button>
    </div>
  </div>);
}

export default Welcome;
