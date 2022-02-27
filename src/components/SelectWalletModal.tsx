import React, { useContext, useState } from 'react';
import './SelectWallet.scss'
import { getWalletBySource, getWallets } from '../lib/wallets/wallets';
import { Modal } from 'antd';
import SelectWallet from './SelectWallet';
import { OpenSelectWallet, WalletContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

interface Props {
  theme: string;
}

function SelectWalletModal ({theme}: Props): React.ReactElement<Props> {
  const openSelectWalletContext = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate();

  return <Modal
    title="Select Wallet"
    className={`select-wallet-modal ${theme === 'dark' ? '-dark' : '-light'}`}
    maskStyle={{backgroundColor: theme === 'dark' ? '#262C4A' : '#EEE'}}
    centered
    visible={openSelectWalletContext.isOpen}
    footer={false}
    onCancel={openSelectWalletContext.close}
    wrapClassName={'sub-wallet-modal-wrapper'}
  >
    <SelectWallet onSelectWallet={(walletKey) => {
      walletContext.setWallet(getWalletBySource(walletKey))
      openSelectWalletContext.close()
      navigate('/wallet-info')
    }}/>
  </Modal>;
}

export default SelectWalletModal
