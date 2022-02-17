import React, { useContext, useState } from 'react';
import './SelectWallet.scss'
import { getWalletBySource, getWallets } from '../lib/wallets';
import { Modal } from 'antd';
import SelectWallet from './SelectWallet';
import { OpenSelectWallet, WalletContext } from '../contexts';
import { useNavigate } from 'react-router-dom';

interface Props {
}

function SelectWalletModal ({}: Props): React.ReactElement<Props> {
  const openSelectWalletContext = useContext(OpenSelectWallet);
  const walletContext = useContext(WalletContext);
  const navigate = useNavigate()

  return <Modal
    title="Select Wallet"
    centered
    visible={openSelectWalletContext.isOpen}
    footer={false}
    onCancel={openSelectWalletContext.close}
  >
    <SelectWallet onSelectWallet={(walletKey) => {
      walletContext.setWallet(getWalletBySource(walletKey))
      openSelectWalletContext.close()
      navigate('/wallet-info')
    }}/>
  </Modal>;
}

export default SelectWalletModal