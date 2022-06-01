// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import './SelectWallet.scss';

import { getWalletBySource } from '@subwallet/wallet-connect/dotsama/wallets';
import { getEvmWalletBySource } from '@subwallet/wallet-connect/evm/evmWallets';
import { Modal } from 'antd';
import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { OpenSelectWallet, WalletContext } from '../contexts';
import SelectWallet from './SelectWallet';

interface Props {
  theme: string;
}

function SelectWalletModal ({ theme }: Props): React.ReactElement<Props> {
  const openSelectWalletContext = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();
  const onSelectWallet = useCallback(
    (walletKey, walletType: 'substrate' | 'evm' = 'substrate') => {
      if (walletType === 'substrate') {
        walletContext.setWallet(getWalletBySource(walletKey), walletType);
        openSelectWalletContext.close();
        navigate('/wallet-info');
      } else {
        walletContext.setWallet(getEvmWalletBySource(walletKey), walletType);
        openSelectWalletContext.close();
        navigate('/evm-wallet-info');
      }
    },
    [navigate, openSelectWalletContext, walletContext]
  );

  return <Modal
    centered
    className={`select-wallet-modal ${theme === 'dark' ? '-dark' : '-light'}`}
    footer={false}
    maskStyle={{ backgroundColor: theme === 'dark' ? '#262C4A' : '#EEE' }}
    onCancel={openSelectWalletContext.close}
    title='Select Wallet'
    visible={openSelectWalletContext.isOpen}
    wrapClassName={'sub-wallet-modal-wrapper'}
  >
    <SelectWallet onSelectWallet={onSelectWallet} />
  </Modal>;
}

export default SelectWalletModal;
