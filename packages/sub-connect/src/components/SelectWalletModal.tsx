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
import { WalletType } from "@subwallet/wallet-connect/types";
import { getWalletConnectWalletBySource } from "@subwallet/wallet-connect/wallet-connect/walletConnectWallets";

interface Props {
  theme: string;
}

function SelectWalletModal ({ theme }: Props): React.ReactElement<Props> {
  const openSelectWalletContext = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();
  const onSelectWallet = useCallback(
    (walletKey, walletType: WalletType = 'substrate') => {
      switch (walletType) {
        case "substrate":
          walletContext.setWallet(getWalletBySource(walletKey), walletType);
          break;
        case "evm":
          walletContext.setWallet(getEvmWalletBySource(walletKey), walletType);
          break;
        case "wallet_connect":
          walletContext.setWallet(getWalletConnectWalletBySource(walletKey), walletType);
          break;
      }

      openSelectWalletContext.close();

      switch (walletType) {
        case "substrate":
          navigate('/wallet-info');
          break;
        case "evm":
          navigate('/evm-wallet-info');
          break;
        case "wallet_connect":
          navigate('/wallet-connect');
          break;
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
