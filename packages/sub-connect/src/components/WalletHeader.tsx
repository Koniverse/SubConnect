// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Button } from 'antd';
import React, { useContext } from 'react';

import { OpenSelectWallet, WalletContext } from '../contexts';

require('./WalletHeader.scss');

interface Props {
  visible?: boolean
}

function WalletHeader ({ visible }: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);
  const selectWallet = useContext(OpenSelectWallet);
  const wallet = walletContext.wallet || walletContext.evmWallet;

  if (!visible) {
    return (<></>);
  }

  return (<header className={'wallet-header-wrapper'}>
    <div className={'boxed-container'}>
      <div className={'wallet-header-content'}>
        <div>
          <img
            alt={wallet?.logo?.alt}
            className={'wallet-logo'}
            src={wallet?.logo?.src}
          />
        </div>
        <div className={'wallet-title'}>
          {wallet?.title}
        </div>
        <div className='spacer' />
        <Button
          className='sub-wallet-btn sub-wallet-btn-small-size'
          onClick={selectWallet.open}
          type={'primary'}
        >Select Wallet</Button>
      </div>
    </div>
  </header>);
}

export default WalletHeader;
